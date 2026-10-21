import "dotenv/config";
import mongoose from "mongoose";

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Add it to server/.env");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log("SUCCESS: Connected to Atlas and ping worked.");
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("FAILED: Could not connect to MongoDB Atlas.");
    console.error(`Reason: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
