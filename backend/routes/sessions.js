const express = require("express");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all sessions for user
router.get("/", auth, async (req, res) => {
  try {
    console.log("Getting sessions for user:", req.user.email);

    const sessions = await Session.find({ userId: req.user._id })
      .sort({ lastUpdated: -1 })
      .select("title lastUpdated createdAt");

    console.log(`Found ${sessions.length} sessions for user`);
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new session
router.post("/", auth, async (req, res) => {
  try {
    console.log("Creating new session for user:", req.user.email);
    const { title } = req.body;

    const session = new Session({
      userId: req.user._id,
      title: title || "New Session",
      chatHistory: [],
      generatedCode: null,
    });

    await session.save();
    console.log("Session created:", session._id);

    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific session
router.get("/:id", auth, async (req, res) => {
  try {
    console.log("Getting session:", req.params.id, "for user:", req.user.email);

    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      console.log("Session not found:", req.params.id);
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session found:", session.title);
    res.json(session);
  } catch (error) {
    console.error("Get session error:", error.message);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Update session
router.put("/:id", auth, async (req, res) => {
  try {
    console.log(
      "Updating session:",
      req.params.id,
      "for user:",
      req.user.email
    );
    const { chatHistory, generatedCode, title } = req.body;

    const updateData = {
      lastUpdated: Date.now(),
    };

    // Only update fields that are provided
    if (chatHistory !== undefined) updateData.chatHistory = chatHistory;
    if (generatedCode !== undefined) updateData.generatedCode = generatedCode;
    if (title !== undefined) updateData.title = title;

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!session) {
      console.log("Session not found for update:", req.params.id);
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session updated:", session.title);
    res.json(session);
  } catch (error) {
    console.error("Update session error:", error.message);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Delete session
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log(
      "Deleting session:",
      req.params.id,
      "for user:",
      req.user.email
    );

    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      console.log("Session not found for deletion:", req.params.id);
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session deleted:", session.title);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error.message);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
