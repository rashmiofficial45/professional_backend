import mongoose from "mongoose"           //importing the mongoose 
import { DB_NAME } from "../constants.js" //importing the DB name as named import

const connectDB = async ()=>{
    // !Connecting the Database with the Backend file
    /*
        Error on initial connection: If initial connection fails, Mongoose will emit an 'error' event and the promise mongoose.connect() returns will reject. However, Mongoose will not automatically try to reconnect.
        Error after initial connection was established: Mongoose will attempt to reconnect, and it will emit an 'error' event.
    */
   //! To handle initial connection errors, you should use .catch() or try/catch with async/await.
   //? Attempt to connect to MongoDB using the provided URL and database name
    try {
        // Await the connection to MongoDB using the 'mongoose' library
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // Log a success message if the connection is established
        console.log(`MONGO_DB CONNECTED !! and the DB_HOST :${connectionInstance.connection.host}`);
    } catch (error) {
        // Log an error message if the connection fails
        console.log("mongoDB connection failed ",error);
        // Exit the process with a non-zero exit code to indicate failure
        process.exit(1);
    }
}
export default connectDB