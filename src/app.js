// Import the 'cors' middleware for handling Cross-Origin Resource Sharing
import cors from "cors"  
// Import the 'cookie-parser' middleware for handling cookies in requests       
import cookieParser from "cookie-parser"
// Import the 'express' framework for building web applications
import express from "express"
// Create an instance of the Express application
const app=express()
//! Enable Cross-Origin Resource Sharing (CORS) middleware with specified origin and credentials configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

//!middlewares 
// Set up middleware to parse incoming JSON requests with a maximum limit of 16KB
app.use(express.json({limit:"16kb"}))

// Set up middleware to parse incoming URL-encoded requests with extended options and a maximum limit of 16KB
app.use(express.urlencoded({extended:true,limit:"16kb"}))

// Serve static files from the "public" directory
app.use(express.static("public"))

// Set up middleware to parse cookies in incoming requests
app.use(cookieParser())

//!routes import and all the controllers are defined under the routers
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)

  export {app}