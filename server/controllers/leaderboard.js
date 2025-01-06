const USER = require('../models/user');
const { LeetCode } = require('leetcode-query');
const leetcode = new LeetCode();

async function handelArrangeLeaderboard(req, res) {
  try {
    // Fetch all users from the database
    const users = await USER.find({});

    // Fetch LeetCode data for all users
    const userRanks = await Promise.all(
      users.map(async (user) => {
        try {
          // Fetch contest history for the user
          const contestHistory = await leetcode.user_contest_info(user.userId);
          const contests = contestHistory.userContestRankingHistory;

          // Get the latest contest (by startTime)
          const latestContest = contests.reduce((latest, contest) => {
            return contest.startTime > latest.startTime ? contest : latest;
          }, contests[0]);

          // Check if the user attended the latest contest
          const stats = await leetcode.user_contest_info(user.userId);

          return {
            name: user.name,
            username: user.userId,
            rating: stats.userContestRanking.rating,
            rank: stats.userContestRanking.globalRanking,
            attended: latestContest.attended, // Add attended status for weekly leaderboard
          };
        } catch (err) {
          console.error(`Error fetching data for ${user.userId}:`, err);
          return null;
        }
      })
    );

    // Filter out null results (in case of fetch errors)
    const validUserRanks = userRanks.filter((user) => user !== null);

    // Separate users into attended and non-attended for weekly leaderboard
    const attendedUserRanks = validUserRanks.filter(user => user.attended);

    // Sort all users for the normal leaderboard by rating in descending order
    validUserRanks.sort((a, b) => {
      const ratingA = parseFloat(a.rating);
      const ratingB = parseFloat(b.rating);
      return ratingB - ratingA;
    });

    // Sort attended users for the weekly leaderboard by rating in descending order
    attendedUserRanks.sort((a, b) => {
      const ratingA = parseFloat(a.rating);
      const ratingB = parseFloat(b.rating);
      return ratingB - ratingA;
    });

    // Render the leaderboard using EJS, passing both normal and weekly leaderboards
    res.render('home', { 
      normalLeaderboard: validUserRanks, 
      weeklyLeaderboard: attendedUserRanks 
    });
  } catch (err) {
    console.error('Error arranging leaderboard:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  handelArrangeLeaderboard,
};
