const express = require("express");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all sessions for user
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ lastUpdated: -1 })
      .select("title lastUpdated");

    res.json(sessions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new session
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;

    const session = new Session({
      userId: req.user._id,
      title: title || "New Session",
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific session
router.get("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update session
router.put("/:id", auth, async (req, res) => {
  try {
    const { chatHistory, generatedCode, title } = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(chatHistory && { chatHistory }),
        ...(generatedCode && { generatedCode }),
        ...(title && { title }),
        lastUpdated: Date.now(),
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
