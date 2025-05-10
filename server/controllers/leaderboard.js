const User = require('../models/user');
const { LeetCode } = require('leetcode-query');
const leetcode = new LeetCode();

/**
 * Get leaderboard data for both regular and weekly rankings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handelArrangeLeaderboard(req, res) {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    if (users.length === 0) {
      return res.json({ 
        normalLeaderboard: [], 
        weeklyLeaderboard: [] 
      });
    }

    // Fetch LeetCode data for all users
    const userRanks = await Promise.all(
      users.map(async (user) => {
        try {
          return await getUserContestData(user);
        } catch (err) {
          console.error(`Error fetching data for ${user.userId}:`, err.message);
          return null;
        }
      })
    );

    // Filter out null results (in case of fetch errors)
    const validUserRanks = userRanks.filter((user) => user !== null);

    // For weekly leaderboard, get users who attended the latest contest
    let weeklyLeaderboard = validUserRanks.filter((user) => user.attended);

    // If no users attended the latest contest, use all users for the weekly leaderboard
    if (weeklyLeaderboard.length === 0) {
      weeklyLeaderboard = generateDefaultWeeklyLeaderboard(validUserRanks);
    }

    // Sort both leaderboards by rating
    const normalLeaderboard = sortByRating([...validUserRanks]);
    weeklyLeaderboard = sortByRating(weeklyLeaderboard);

    // Return JSON data
    res.json({ normalLeaderboard, weeklyLeaderboard });
  } catch (err) {
    console.error('Error arranging leaderboard:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Fetch contest data for a user and format it
 * @param {Object} user - User document from MongoDB
 * @returns {Object} Formatted user contest data
 */
async function getUserContestData(user) {
  // Fetch contest history for the user
  const contestHistory = await leetcode.user_contest_info(user.userId);
  
  if (!contestHistory.userContestRankingHistory || contestHistory.userContestRankingHistory.length === 0) {
    return {
      name: user.name,
      username: user.userId,
      usn: user.usn,
      rating: contestHistory.userContestRanking?.rating || 0,
      rank: contestHistory.userContestRanking?.globalRanking || 0,
      attended: false,
      trend: "",
      title: "",
      time: "",
    };
  }
  
  const contests = contestHistory.userContestRankingHistory;

  // Identify the latest contest based on startTime
  const latestContest = contests.reduce((latest, contest) => {
    return contest.contest.startTime > latest.contest.startTime ? contest : latest;
  }, contests[0]);

  // Check if the user attended the latest contest
  const attendedLatest = latestContest.attended;

  // Format the contest timing
  const formattedTime = formatTimestamp(latestContest.contest.startTime);

  return {
    name: user.name,
    username: user.userId,
    usn: user.usn,
    rating: contestHistory.userContestRanking?.rating || 0,
    rank: contestHistory.userContestRanking?.globalRanking || 0,
    attended: attendedLatest,
    trend: latestContest.trendDirection || "",
    title: latestContest.contest.title || "",
    time: formattedTime,
  };
}

/**
 * Format timestamp to human-readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleString('en-US', options);
}

/**
 * Generate a default weekly leaderboard when no users attended the latest contest
 * @param {Array} users - Array of user data
 * @returns {Array} Default weekly leaderboard
 */
function generateDefaultWeeklyLeaderboard(users) {
  if (users.length === 0) return [];
  
  const defaultTitle = "Weekly Contest";
  const defaultTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Add default title and time to each user
  return users.map(user => ({
    ...user,
    title: defaultTitle,
    time: defaultTime,
    attended: true // Force attended to true for display purposes
  }));
}

/**
 * Sort users by rating in descending order
 * @param {Array} users - Array of user data
 * @returns {Array} Sorted users
 */
function sortByRating(users) {
  return [...users].sort((a, b) => {
    const ratingA = parseFloat(a.rating) || 0;
    const ratingB = parseFloat(b.rating) || 0;
    return ratingB - ratingA;
  });
}

module.exports = {
  handelArrangeLeaderboard,
};
