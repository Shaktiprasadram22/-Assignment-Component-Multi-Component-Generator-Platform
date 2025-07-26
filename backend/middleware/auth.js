const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware called");
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);

    // Get token from cookie first, then Authorization header
    let token = req.cookies.token;

    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      console.log("No token provided - checking cookies and headers failed");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    console.log("Token found, verifying...");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded.userId);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    console.log("User authenticated successfully:", user.email);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    // More specific error messages for debugging
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token is not valid" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      return res.status(401).json({ message: "Token is not valid" });
    }
  }
};

module.exports = auth;
