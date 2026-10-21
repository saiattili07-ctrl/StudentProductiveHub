import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { csrfProtection } from "./middleware/csrfMiddleware.js";
import notFound from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// Security headers
app.use(helmet());

// Allow only our frontend to call the API, and allow cookies
app.use(
  cors({
origin: [
  "http://localhost:5173",
  "https://student-productive-hub-pk4s.vercel.app",
  "https://student-productive-hub-pk4s-nix36nfrr-sais-projects-87f0bc83.vercel.app"
],
credentials: true,
  }),
);

// Request logging in development only
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body and cookie parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF check for every state-changing /api request
app.use("/api", csrfProtection);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

// These two must stay LAST
app.use(notFound);
app.use(errorHandler);

export default app;
