const User = require('../models/user')
const { LeetCode } = require('leetcode-query')
const axios = require('axios')

// Create LeetCode API instance
const leetcode = new LeetCode()

/**
 * Test LeetCode API connectivity
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function testLeetCodeApi() {
  try {
    const testUser = 'zhenya_'
    console.log(`Testing LeetCode API with user: ${testUser}`)
    const result = await leetcode.user_contest_info(testUser)
    console.log(`LeetCode API test successful!`)
    return true;
  } catch (error) {
    console.error('LeetCode API test failed:', error.message)
    
    try {
      console.log('Attempting direct API call as fallback...')
      const response = await axios.get('https://leetcode.com/api/problems/algorithms/')
      console.log('Direct API call successful!')
      return true;
    } catch (fallbackError) {
      console.error('Direct API call also failed:', fallbackError.message)
      return false;
    }
  }
}

/**
 * Handle registering a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handelAddNewUser(req, res) {
  try {
    const { name, user } = req.body

    // Validate input
    if (!user) return res.status(400).json({ error: 'Enter Username' })
    if (!name) return res.status(400).json({ error: 'Enter Your Name' })

    // Check if username or name already exists
    const existingUser = await User.findOne({ userId: user })
    const existingName = await User.findOne({ name })

    if (existingUser) {
      return res.status(400).json({ error: `Username "${user}" already exists.` })
    } else if (existingName) {
      return res.status(400).json({ error: `Name "${name}" already exists.` })
    }

    // Create new user
    const newUser = await User.create({
      userId: user,
      name,
    })

    return res.status(200).json({ 
      success: true, 
      name,
      user,
      id: newUser._id 
    })
  } catch (error) {
    console.error('Error adding new user:', error)
    return res.status(500).json({ error: 'Server error while adding user' })
  }
}

/**
 * Get user contest information from LeetCode
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handelGetUser(req, res) {
  try {
    const { username } = req.params
    
    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' })
    }
    
    console.log(`Fetching contest data for username: ${username}`)
    
    try {
      // Attempt to fetch contest data from LeetCode API
      const contestData = await leetcode.user_contest_info(username)
      
      return res.status(200).json({
        userContestDetails: contestData,
      })
    } catch (leetcodeError) {
      // Try alternative approach - get basic user info first
      try {
        const userData = await leetcode.user(username)
        
        return res.status(200).json({
          userData,
          message: 'Contest data unavailable, but user exists',
        })
      } catch (userError) {
        return res.status(404).json({ 
          message: 'User not found on LeetCode',
          error: userError.message 
        })
      }
    }
  } catch (error) {
    console.error(`Error processing request:`, error)
    
    return res.status(500).json({ 
      message: 'Error fetching user data', 
      error: error.message 
    })
  }
}

module.exports = {
  handelAddNewUser,
  handelGetUser,
  testLeetCodeApi
} 