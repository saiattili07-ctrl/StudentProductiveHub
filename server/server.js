import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Log unexpected promise rejections and shut down cleanly
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle Ctrl+C: stop the server, then close the database connection
process.on("SIGINT", async () => {
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
