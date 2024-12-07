const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'your_mongodb_connection_string';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Define a schema for leaderboard data
const leaderboardSchema = new mongoose.Schema({
  username: String,
  totalSolved: Number,
  ranking: Number,
  date: { type: Date, default: Date.now }
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// Fetch user data from LeetCode API
app.get('/api/leaderboard/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    // Save to MongoDB
    const { totalSolved, ranking } = response.data;
    const userStats = new Leaderboard({ username, totalSolved, ranking });
    await userStats.save();
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function fetchData() {
  const username = document.getElementById('username').value;
  const userDataDiv = document.getElementById('userData');
  userDataDiv.innerHTML = ''; // Clear previous data

  try {
    const response = await fetch(`http://localhost:5000/api/leaderboard/${username}`);
    if (!response.ok) throw new Error('User not found or API error');

    const data = await response.json();
    userDataDiv.innerHTML = `
      <h2>${data.username}'s Stats</h2>
      <p>Total Problems Solved: ${data.totalSolved}</p>
      <p>Ranking: ${data.ranking}</p>
    `;
  } catch (error) {
    userDataDiv.innerHTML = `<p class="error">Error fetching data: ${error.message}</p>`;
  }
}
