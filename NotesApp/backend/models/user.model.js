const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a User document in MongoDB
const userSchema = new Schema({
    fullName: { type: String },     // User's full name
    email: { type: String },        // User's email address
    password: { type: String },     // User's hashed password
    createdOn: { type: Date, default: new Date().getTime() }, // Account creation timestamp
});

module.exports = mongoose.model("User", userSchema);

