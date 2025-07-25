const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const aiRoutes = require("./routes/ai");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: ["https://jazzy-gecko-b98462.netlify.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

// Add a specific route to handle auth status checks
app.get("/api/auth/status", (req, res) => {
  try {
    // If you have auth middleware, this should check if user is authenticated
    // For now, just return a basic response
    res.json({
      authenticated: false,
      user: null,
      message: "Auth status check",
    });
  } catch (error) {
    console.error("Auth status error:", error);
    res.status(500).json({ error: "Auth status check failed" });
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("404 - Route not found:", req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
