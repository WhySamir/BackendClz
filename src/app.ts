import express  from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()
import connectDB from "./db/index";

const serverConnect = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
    }
    serverConnect()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/health",(req,res)=>{
    res.json({status:"ok",timeStamp:new Date().toISOString()})
})

app.listen(PORT ,()=>{
console.log(`Serving running at ${PORT}`)
})
console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
console.log("Using DB:", process.env.DB_NAME);
console.log("Removed account")
export default app