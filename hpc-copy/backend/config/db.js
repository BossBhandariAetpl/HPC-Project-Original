import mongoose from "mongoose";

const connectDB = async () => {                             // asynchronous function that wait for the database to connect
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) // await represents to let the application to wait till the database is connected via .env file
        console.log(`MongoDB Connected: ${conn.connection.host}`)  // shows the successful message that the database is connected 
    } catch (error) {  
        console.error(`Error ${error.message}`);                   // show sthe error message 
        process.exit(1);                                           // exits the database and let the nodejs know to exit if unsuccessful
    }
}

export default connectDB;                                         // finally default exports