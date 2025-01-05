const USER = require('../models/user'); // Assuming user model contains LeetCode usernames
const { LeetCode } = require('leetcode-query');

const leetcode = new LeetCode();

async function handelArrangeLeaderboard(req, res) {
  try {
    // Fetch all users from the database
    const users = await USER.find({}); // Assuming USER model has `userId` field

    // Fetch LeetCode data for all users
    const userRanks = await Promise.all(
      users.map(async (user) => {
        try {
          const stats = await leetcode.user(user.userId);
          return {
            name: user.name,
            username: user.userId,
            rank: stats.matchedUser.profile.ranking,
            solved: stats.matchedUser.submitStats.acSubmissionNum[0].count,
          };
        } catch (err) {
          console.error(`Error fetching data for ${user.userId}:`, err);
          return null;
        }
      })
    );

    // Filter out null results (in case of fetch errors)
    const validUserRanks = userRanks.filter((user) => user !== null);

    // Sort users by rank
    validUserRanks.sort((a, b) => a.rank - b.rank);
    console.log(validUserRanks);
    
    // Render the leaderboard using EJS
    res.render('home', { users: validUserRanks });
  } catch (err) {
    console.error('Error arranging leaderboard:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  handelArrangeLeaderboard,
};
