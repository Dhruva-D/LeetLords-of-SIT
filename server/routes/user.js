const express = require('express')
const { handelAddNewUser } = require('../controllers/user')

const router = express.Router()

router.post('/users', handelAddNewUser)
// router.get('/', )


module.exports = router; 
