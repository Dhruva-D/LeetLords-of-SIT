const express = require('express')
const { handelAddNewUser, handelGetUser } = require('../controllers/user')

const router = express.Router()

router.post('/users', handelAddNewUser)
router.get('/:username', handelGetUser)


module.exports = router;