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
 * Validate SIT USN format
 * @param {string} usn - USN to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUSN(usn) {
  if (!usn) return false;
  
  // Standardize input to uppercase
  const usnUpper = usn.toUpperCase();
  
  // USN must start with 1SI or 4SI and be exactly 10 characters
  const usnPattern = /^[14]SI\d{2}[A-Z]{2}\d{3}$/;
  return usnPattern.test(usnUpper);
}

/**
 * Handle registering a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handelAddNewUser(req, res) {
  try {
    const { name, user, usn } = req.body

    // Validate input
    if (!user) return res.status(400).json({ error: 'Enter Username' })
    if (!name) return res.status(400).json({ error: 'Enter Your Name' })
    if (!usn) return res.status(400).json({ error: 'Enter Your SIT USN' })

    // Validate USN format
    if (!isValidUSN(usn)) {
      return res.status(400).json({ 
        error: 'Invalid USN format. USN must start with 1SI or 4SI and follow the format like 1SI23CI013'
      })
    }

    // Standardize USN to uppercase
    const standardizedUSN = usn.toUpperCase();

    // Check if username, name or USN already exists
    const existingUser = await User.findOne({ userId: user })
    const existingName = await User.findOne({ name })
    const existingUSN = await User.findOne({ usn: standardizedUSN })

    if (existingUser) {
      return res.status(400).json({ error: `Username "${user}" already exists.` })
    } else if (existingName) {
      return res.status(400).json({ error: `Name "${name}" already exists.` })
    } else if (existingUSN) {
      return res.status(400).json({ error: `USN "${standardizedUSN}" already exists.` })
    }

    // Create new user
    const newUser = await User.create({
      userId: user,
      name,
      usn: standardizedUSN,
    })

    return res.status(200).json({ 
      success: true, 
      name,
      user,
      usn: standardizedUSN,
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
    
    console.log(`Fetching data for username: ${username}`)
    
    // Initialize response data
    let responseData = {}
    
    // First, try to get basic user data
    try {
      const userData = await leetcode.user(username)
      responseData.userData = userData
    } catch (userError) {
      console.error(`Error fetching user data: ${userError.message}`)
      return res.status(404).json({ 
        message: 'User not found on LeetCode',
        error: userError.message 
      })
    }
    
    // If user data was found, try to get contest data
    try {
      const contestData = await leetcode.user_contest_info(username)
      responseData.userContestDetails = contestData
    } catch (contestError) {
      console.error(`Error fetching contest data: ${contestError.message}`)
      responseData.contestError = 'Contest data unavailable'
    }
    
    // Try to get user's recent submissions
    try {
      const recentSubmissions = await leetcode.recent_submissions(username)
      responseData.recentSubmissions = recentSubmissions
    } catch (submissionsError) {
      console.error(`Error fetching recent submissions: ${submissionsError.message}`)
      responseData.submissionsError = 'Recent submissions data unavailable'
    }
    
    return res.status(200).json(responseData)
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