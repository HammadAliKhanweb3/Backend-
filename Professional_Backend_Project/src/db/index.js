import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DB_NAME}`
    );
    console.log(
      `/n MongoDb Connected !DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Mongodb Connection error:", error);
    process(1);
  }
};

export default connectDB;
