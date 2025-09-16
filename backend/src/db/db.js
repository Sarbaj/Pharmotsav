import mongoose from "mongoose";
import { DB_NAME } from "../costants.js";

const connectDB=async()=>{
    try {
        const DbInstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log('MongoDB connnected: DB Host- ',DbInstance.connection.host);
    } catch (error) {
        console.log('DB_Connnection_Error: ',error);
        process.exit(1)

    }
}

export default connectDB