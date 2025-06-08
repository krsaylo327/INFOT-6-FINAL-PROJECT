const bcrypt = require("bcrypt");
require('dotenv').config();
const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);
const User = require("./models/user.model");
const Note = require("./models/note.model");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// Body parser middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
  })
);

const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

// Root endpoint for testing server
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account endpoint
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, email, password } = req.body || {};

        // Validate required fields
        if (!fullName) return res.status(400).json({ error: true, message: "Full name is required" });
        if (!email) return res.status(400).json({ error: true, message: "Email is required" });
        if (!password) return res.status(400).json({ error: true, message: "Password is required" });

        // Check if user already exists
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        // Hash the password before saving
        const user = new User({
            fullName,
            email,
            password: await bcrypt.hash(password, 10), 
        });

        await user.save();

        const payload = { users: { _id: user._id, email: user.email } };   

        // Create JWT payload and token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });

        // Respond with user info and token
        return res.json({
            error: false,
            user: { fullName: user.fullName, email: user.email, _id: user._id },
            accessToken,
            message: "Registration Successful",
        });
    }   catch (error) {
        console.error("Create-account error:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  // Validate required fields
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Find user by email
  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(400).json({ message: "Your account is not registered." });
  }

  // Compare password with hashed password
  const isMatch = await bcrypt.compare(password, userInfo.password);

  if (isMatch) {
    const user = userInfo;

    // Create JWT token
    const accessToken = jwt.sign({ users: user }, tokenSecret, {
      expiresIn: "20600 minutes",
    });

    // Respond with token
    return res.json({
      error: false,
      user: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({ error: true, message: "Invalid Credentials" });
  }
});


// Get User endpoint (protected)
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    // Extract userId from JWT payload
    const userId = req.user.users._id;

    if (!userId) {
        return res.status(401).json({ error: true, message: "Unauthorized: No userId" });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({ error: true, message: "Unauthorized: User not found" });
    }

    // Respond with user info
    return res.json({
        user,
        message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error in /get-user:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


// Search Notes endpoint (protected)
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { users } = req.user;

  // Validate query parameter
  if (!query) {
    return res.status(400).json({ error: true, message: "Query parameter is required" });
  }

  try {
    // Search notes where title or content contains the query (case-insensitive)
    const notes = await Note.find({
      userID: users._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ],
    });

    return res.json({
      error: false,
      notes,
      message: "Search results",
    });
  } catch (error) {
    console.error("Error in /search-notes:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


// Add Note endpoint (protected)
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { users } = req.user;

  // Validate required fields
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: true, message: "Content is required" });
  }

  try {
    // Create and save new note
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userID: users._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Note endpoint (protected)
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { users } = req.user;

  // Check if none of the editable fields are provided
  if (!title && !content && !tags && typeof isPinned === "undefined") {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    // Find the note by ID and user
    const note = await Note.findOne({ _id: noteId, userID: users._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Update fields if provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned !== "undefined") note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get All Notes endpoint (protected)
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { users } = req.user;

  try {
    // Find all notes for the user, sorted by pinned status and last update
    const notes = await Note.find({ userID: users._id }).sort({ isPinned: -1, updatedAt: -1 });///({ userID: users._id });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Note endpoint (protected)
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { users } = req.user;

  try {
    // Find the note by ID and user
    const note = await Note.findOne({ _id: noteId, userID: users._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Delete the note
    await Note.deleteOne({ _id: noteId, userID: users._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update isPinned Value endpoint (protected)
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { users } = req.user;

  try {
    // Find the note by ID and user
    const note = await Note.findOne({ _id: noteId, userID: users._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Update the isPinned status
    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Start the server on port 8000
app.listen(8000);

module.exports = app;
