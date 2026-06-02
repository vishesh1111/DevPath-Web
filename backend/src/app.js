const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const assistantRoutes = require("./routes/assistant");
const { notFoundHandler, errorHandler } = require("./middlewares/errorMiddleware");
const { requestLoggerStream } = require("./utils/logger");

const app = express();

// Global middleware stack: CORS -> JSON parser -> request logs
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined", { stream: requestLoggerStream }));

// Lightweight uptime probe for deployments/health checks.
app.get("/health", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Assistant backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/assistant", assistantRoutes);

// Terminal middleware pair for unknown routes and runtime failures.
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
