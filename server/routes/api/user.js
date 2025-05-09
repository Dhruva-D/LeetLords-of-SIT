const express = require('express');
const { handelGetUser } = require('../../controllers/user');

const router = express.Router();

/**
 * @route   GET /api/user/info/:username
 * @desc    Get information about a specific user from LeetCode
 * @access  Public
 */
router.get('/info/:username', handelGetUser);

/**
 * @route   GET /api/user/test
 * @desc    Test endpoint to verify user routes are working
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({ 
    message: 'User route is working',
    timestamp: new Date().toISOString(),
    route: '/api/user/test'
  });
});

module.exports = router; 