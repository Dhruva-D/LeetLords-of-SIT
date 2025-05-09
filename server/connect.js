const mongoose = require('mongoose')

/**
 * Connect to MongoDB database
 * @param {string} url - MongoDB connection string
 * @returns {Promise} Mongoose connection promise
 */
async function connectToMongoDB(url) {
  try {
    if (!url) {
      throw new Error('MongoDB connection URL is required');
    }
    
    return await mongoose.connect(url);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error; // Re-throw to be handled by the caller
  }
}

module.exports = {
  connectToMongoDB,
}