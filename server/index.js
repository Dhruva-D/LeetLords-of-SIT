const express = require('express');
require('dotenv').config();
const { connectToMongoDB } = require('./connect');
const path = require('path');
const cors = require('cors');
const { handelGetUser, testLeetCodeApi } = require('./controllers/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and test LeetCode API
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Test LeetCode API connectivity after MongoDB connection
    testLeetCodeApi()
      .then(success => {
        if (success) {
          console.log("LeetCode API connection test completed successfully");
        } else {
          console.warn("LeetCode API connection test failed - some features may not work correctly");
        }
      })
      .catch(err => {
        console.error("Error testing LeetCode API:", err.message);
      });
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/leaderboard', require('./routes/api/leaderboard'));
app.use('/api/register', require('./routes/user'));
app.use('/api/user', require('./routes/api/user'));

// Direct route for user info
app.get('/api/direct/user/:username', handelGetUser);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
