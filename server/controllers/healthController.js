import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

const dbStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getHealth = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbConnected = dbState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    status: dbConnected ? "ok" : "degraded",
    message: "Student Productivity Hub API is running",
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStates[dbState] || "unknown",
      name: mongoose.connection.name || null,
    },
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
