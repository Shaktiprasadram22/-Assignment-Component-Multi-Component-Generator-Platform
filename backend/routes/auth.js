const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup attempt:", req.body.email);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = new User({ email, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with proper cross-origin settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser set domain
    };

    res.cookie("token", token, cookieOptions);

    console.log("User created successfully:", user.email);
    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email: user.email },
      token: token, // Also send token in response for frontend storage
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body.email);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with proper cross-origin settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      domain: process.env.NODE_ENV === "production" ? undefined : undefined, // Let browser set domain
    };

    res.cookie("token", token, cookieOptions);

    console.log("Login successful:", user.email);
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
      token: token, // Also send token in response for frontend storage
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res.clearCookie("token", cookieOptions);
  console.log("User logged out");
  res.json({ message: "Logged out successfully" });
});

// Get current user - Enhanced with better error handling
router.get("/me", auth, (req, res) => {
  try {
    console.log("GET /me called, user:", req.user.email);
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Test authentication endpoint
router.get("/test", auth, (req, res) => {
  res.json({
    message: "Authentication working!",
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

module.exports = router;
