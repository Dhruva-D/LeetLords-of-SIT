const express = require('express')
const { handelAddNewUser, handelGetUser } = require('../controllers/user')

const router = express.Router()

router.post('/', handelAddNewUser)
router.get('/getinfo/:username', handelGetUser)


module.exports = router;