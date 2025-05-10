const mongoose = require('mongoose');

/**
 * User Schema for registered LeetCode users
 * @typedef {Object} User
 * @property {string} userId - LeetCode username
 * @property {string} name - User's display name
 * @property {string} usn - SIT University Serial Number
 * @property {Date} createdAt - When the user was registered
 * @property {Date} updatedAt - When the user was last updated
 */
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[14]SI\d{2}[A-Z]{2}\d{3}$/i, 'Please enter a valid SIT USN (e.g., 1SI23CI013)']
  },
  //usn, linkedin , github , so we can make a profiel for each of them (if it works)
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;