const express = require('express')
const { handelArrangeLeaderboard } = require('../controllers/leaderboard')

const router = express.Router()

router.get('/', handelArrangeLeaderboard)


module.exports = router;