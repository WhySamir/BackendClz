import mongoose, { Document, Schema, Types } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";



export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  password: string;
  refreshToken?: string;
  googleId?: string;
}



const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true, //enable opitimize searchable database
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cdn url
      required: true,
    },
   
   
    password: {
      type: String,
      required: function () {
        // Require password only if the user is NOT signing up with Google
        return !this.googleId;
      },
    },
    refreshToken: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

//before saving database pre hook used to encrypt or any  operation
//pre ma callback ()=>{} use nagarne cause this context won't work so use asyncfn
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//custom methods isPasswordCorrect
//bcrypt libary can hash and also can check original pw  not hashed pw or simply compare(bcrypt method)
userSchema.methods.isPasswordCorrect = async function (password:string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

  if (!secret || !expiresIn) {
    throw new Error("ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not defined");
  }

  const payload = {
    _id: this.id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  };

  const options: SignOptions = {
  expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
};


  return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function () {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;

  if (!secret || !expiresIn) {
    throw new Error("REFRESH_TOKEN_SECRET or REFRESH_TOKEN_EXPIRY is not defined");
  }

  const payload = {
    _id: this.id,
  };

  const options: SignOptions = {
  expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
};


  return jwt.sign(payload, secret, options);
};

export const User = mongoose.model("User", userSchema);
