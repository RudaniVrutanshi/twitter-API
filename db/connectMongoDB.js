import mongoose from "mongoose";

const connectMongoDB = async() =>{
    try 
    {
        const conn = await mongoose.connect(process.env.MOGODB_URI);
        console.log(`mongoDb connected: ${conn.connection.host}`);
    }
    catch(error)
    {
        console.error(`Error connection to mongoDB: ${error.message}`);
        process.exit(1);

    }
} 

export default connectMongoDB;