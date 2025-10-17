import mongoose from "mongoose";

export const connectDb = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined in environment");
    }
    await mongoose.connect(uri);
    console.log("Database Connected");
}