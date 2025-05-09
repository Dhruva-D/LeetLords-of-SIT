const express = require('express');
const { handelArrangeLeaderboard } = require('../../controllers/leaderboard');

const router = express.Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get both normal and weekly leaderboard data
 * @access  Public
 */
router.get('/', handelArrangeLeaderboard);

module.exports = router;