const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a Note document in MongoDB
const noteSchema = new Schema({
    title: { type: String, required: true},         // Note title (required)
    content: { type: String, required: true},       // Note content (required)
    tags: { type: [String], default: []},           // Array of tags (optional)
    isPinned: { type: Boolean, default: false},     // Pin status (default: not pinned)
    userID: { type: String, required: true},        // ID of the user who owns the note (required)
    pinnedAt: { type: Date, default: null },        // Date when the note was pinned (optional)
    createdOn: { type: Date, default: () => new Date() },   // Creation date (default: now)

});

module.exports = mongoose.model("Note", noteSchema);