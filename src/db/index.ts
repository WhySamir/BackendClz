import mongoose from "mongoose";

const connectDB = async () => {
  try {

     const mongoUri =
      process.env.MONGO_URI || //  Use this during tests
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

  const connectionInstance = await mongoose.connect(mongoUri);
    console.log(
      `\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB Connection Failed", error);
    process.exit(1);
  }
};
export default connectDB;