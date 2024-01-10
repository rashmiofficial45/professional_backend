// import mongoose from "mongoose"
// import { DB_NAME } from "./constants"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
dotenv.config({
    path:"./.env"
})
import {app} from './app.js'
connectDB()
.then(()=>{
    app.get('/', (req, res) => {
        res.send('Hello, this is the root!');
      });
      
    app.listen(process.env.PORT||8000 ,()=>{
        console.log(`App is listening on PORT: http://localhost:${process.env.PORT}`);
    })
})
.catch ((err)=>{
    console.log("ERROR:",err);
    throw err
})



/*
;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR:",error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on PORT:${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR:",error);
        throw error
    }
})()
*/