import mongoose from "mongoose";

const connectDB = () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
  }

  try {
    const connection = mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully.");
    return connection;
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;