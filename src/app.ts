import express  from "express";
import cors from "cors"
import dotenv from "dotenv"
import taskRoutes from "./routes/taskRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";

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
    if (process.env.NODE_ENV !== "test") {
  serverConnect();
}

const app = express()
const PORT = process.env.PORT || 8080

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks CRUD API",
      version: "1.0.0",
      description:
        "A simple Tasks CRUD API with Express, TypeScript, and MongoDB",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerUiOptions = {
  customSiteTitle: "Tasks API Docs",
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);


app.get("/health",(req,res)=>{
    res.json({status:"ok",timeStamp:new Date().toISOString()})
})

app.listen(PORT ,()=>{
console.log(`Serving running at ${PORT}`)
})
console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
console.log("Using DB:", process.env.DB_NAME);
console.log("Removed account")

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



export default app