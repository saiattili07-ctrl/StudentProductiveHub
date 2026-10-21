import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to server/.env");
  }

  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `MongoDB Atlas connected: ${conn.connection.host} (database: ${conn.connection.name})`,
  );

  return conn;
};

export default connectDB;
