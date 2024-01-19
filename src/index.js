//? Import the 'dotenv' library for handling environment variables
import dotenv from "dotenv" 
//?Import the 'connectDB' function from the './db/index.js' module
import connectDB from "./db/index.js"


//? Load environment variables from the '.env' file
dotenv.config({
    path:"./.env"
})

//? Import the 'app' instance from the './app.js' module
import {app} from './app.js'

//? Connect to the database
connectDB()
.then(()=>{

    //? Define a route for the root endpoint
    app.get('/', (req, res) => {
        res.send('Hello, this is the root!');
      });
    //? Start the Express server, listening on the specified port or defaulting to 8000
    app.listen(process.env.PORT||8000 ,()=>{
        console.log(`App is listening on PORT: http://localhost:${process.env.PORT}`);
    })
})
//? Handle and log any errors that occur during database connection
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