const express = require('express')
const { handelAddNewUser } = require('../controllers/user')

const router = express.Router()

/**
 * @route   POST /api/register
 * @desc    Register a new user for the leaderboard
 * @access  Public
 */
router.post('/', handelAddNewUser)

module.exports = router;