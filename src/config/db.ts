import mongoose from "mongoose";

export async function connectDb(mongoUri: string) {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
}

