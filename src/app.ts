import mongoose from "mongoose";
import express  from "express";
import cors from "cors"
import dotenv from "dotenv"
import { timeStamp } from "console";

dotenv.config()

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
