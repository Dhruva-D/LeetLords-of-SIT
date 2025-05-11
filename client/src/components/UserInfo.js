import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './UserInfo.css';

// Create axios instance with explicit backend URL and timeout
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  withCredentials: false
});

const UserInfo = () => {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (userToFetch) => {
    if (!userToFetch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Always fetch fresh data - no caching
      const response = await api.get(`/api/user/info/${userToFetch}`);
      
      // Process the data
      const userData = response.data.userData || {};
      const contestData = response.data.userContestDetails || {};
      
      // Calculate solved problems by difficulty
      const problemStats = {
        total: userData.submitStats?.acSubmissionNum?.[0]?.count || 0,
        easy: userData.submitStats?.acSubmissionNum?.[1]?.count || 0,
        medium: userData.submitStats?.acSubmissionNum?.[2]?.count || 0,
        hard: userData.submitStats?.acSubmissionNum?.[3]?.count || 0
      };
      
      // Process contest history
      const contestHistory = contestData.userContestRanking?.attendedContestsCount || 0;
      const contestRating = contestData.userContestRanking?.rating?.toFixed(2) || 'N/A';
      const globalRank = contestData.userContestRanking?.globalRanking || 'N/A';
      const topPercentage = contestData.userContestRanking?.topPercentage?.toFixed(2) || 'N/A';
      
      // Get recent contests (last 5)
      const recentContests = contestData.userContestRankingHistory?.slice(0, 5) || [];
      
      // Calculate best rank
      let bestRank = Number.MAX_SAFE_INTEGER;
      let bestContestName = '';
      
      if (contestData.userContestRankingHistory) {
        contestData.userContestRankingHistory.forEach(contest => {
          if (contest.ranking && contest.ranking < bestRank) {
            bestRank = contest.ranking;
            bestContestName = contest.contestName;
          }
        });
      }
      
      // Calculate activity in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      let last30DaysActivity = 0;
      let last7DaysActivity = 0;
      
      // Calculate user tier based on rating
      let tier = 'Novice';
      let tierColor = '#8E8E8E';
      let tierIcon = '🥉';
      
      const rating = parseFloat(contestRating);
      if (!isNaN(rating)) {
        if (rating >= 2800) {
          tier = 'Legendary';
          tierColor = '#FF4500';
          tierIcon = '👑';
        } else if (rating >= 2400) {
          tier = 'Grandmaster';
          tierColor = '#FF0000';
          tierIcon = '💎';
        } else if (rating >= 2000) {
          tier = 'Master';
          tierColor = '#FF8C00';
          tierIcon = '🏆';
        } else if (rating >= 1600) {
          tier = 'Expert';
          tierColor = '#9932CC';
          tierIcon = '⭐';
        } else if (rating >= 1200) {
          tier = 'Specialist';
          tierColor = '#0000FF';
          tierIcon = '🥈';
        } else if (rating >= 800) {
          tier = 'Apprentice';
          tierColor = '#008000';
          tierIcon = '🥉';
        }
      }
      
      // Compile all the processed data
      const processedData = {
        username: userToFetch,
        realName: userData.realName || userToFetch,
        profilePicture: userData.userAvatar || null,
        problemStats,
        contestHistory,
        contestRating,
        globalRank,
        topPercentage,
        recentContests,
        bestRank: bestRank === Number.MAX_SAFE_INTEGER ? 'N/A' : bestRank,
        bestContestName,
        last30DaysActivity,
        last7DaysActivity,
        tier,
        tierColor,
        tierIcon
      };
      
      setUserInfo(processedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    // Reset previous user data
    setUserInfo(null);
    
    // Fetch user data
    await fetchUserData(username);
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Coder Profile</h1>
      </div>

      <div className="search-container">
        <form onSubmit={handleSubmit} className="username-search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode Username"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner-small"></div> : 'Search'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching latest data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <p className="error-suggestion">Try usernames like: "zhenya_", "vitalii_v", or check if LeetCode API is available.</p>
        </div>
      )}

      {userInfo && (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-info">
              {userInfo.profilePicture && (
                <div className="profile-picture">
                  <img src={userInfo.profilePicture} alt={userInfo.username} />
                </div>
              )}
              <div className="profile-details">
                <h2>{userInfo.realName}</h2>
                <div className="username">@{userInfo.username}</div>
                <div className="tier-badge" style={{ backgroundColor: userInfo.tierColor }}>
                  <span className="tier-icon">{userInfo.tierIcon}</span>
                  <span>{userInfo.tier}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card ranking-card">
              <h3>Contest Performance</h3>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-value highlight">{userInfo.contestRating}</div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userInfo.globalRank}</div>
                  <div className="stat-label">Global Rank</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userInfo.topPercentage}%</div>
                  <div className="stat-label">Top %</div>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-value">{userInfo.contestHistory}</div>
                  <div className="stat-label">Contests</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userInfo.bestRank}</div>
                  <div className="stat-label">Best Rank</div>
                </div>
              </div>
              {userInfo.bestContestName && (
                <div className="best-contest">
                  <span className="trophy-icon">🏆</span> Best performance in: {userInfo.bestContestName}
                </div>
              )}
            </div>

            <div className="stats-card problem-stats-card">
              <h3>Problem Solving</h3>
              <div className="total-solved">
                <div className="big-number">{userInfo.problemStats.total}</div>
                <div className="label">Problems Solved</div>
              </div>
              <div className="difficulty-breakdown">
                <div className="difficulty-item">
                  <div className="difficulty-label easy">
                    <span className="difficulty-dot"></span>
                    Easy
                  </div>
                  <div className="difficulty-bar-container">
                    <div 
                      className="difficulty-bar easy" 
                      style={{ width: `${calculatePercentage(userInfo.problemStats.easy, userInfo.problemStats.total)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">{userInfo.problemStats.easy}</div>
                </div>
                <div className="difficulty-item">
                  <div className="difficulty-label medium">
                    <span className="difficulty-dot"></span>
                    Medium
                  </div>
                  <div className="difficulty-bar-container">
                    <div 
                      className="difficulty-bar medium" 
                      style={{ width: `${calculatePercentage(userInfo.problemStats.medium, userInfo.problemStats.total)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">{userInfo.problemStats.medium}</div>
                </div>
                <div className="difficulty-item">
                  <div className="difficulty-label hard">
                    <span className="difficulty-dot"></span>
                    Hard
                  </div>
                  <div className="difficulty-bar-container">
                    <div 
                      className="difficulty-bar hard" 
                      style={{ width: `${calculatePercentage(userInfo.problemStats.hard, userInfo.problemStats.total)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">{userInfo.problemStats.hard}</div>
                </div>
              </div>
            </div>
          </div>

          {userInfo.recentContests && userInfo.recentContests.length > 0 && (
            <div className="recent-contests-card">
              <h3>Recent Contests</h3>
              <div className="contests-table">
                <div className="contests-header">
                  <div className="contest-cell">Contest</div>
                  <div className="contest-cell">Rank</div>
                  <div className="contest-cell">Score</div>
                  <div className="contest-cell">Rating Change</div>
                </div>
                {userInfo.recentContests.map((contest, index) => {
                  const ratingChange = contest.rating - (userInfo.recentContests[index + 1]?.rating || contest.rating);
                  const isPositive = ratingChange > 0;
                  
                  return (
                    <div key={index} className="contest-row">
                      <div className="contest-cell contest-name">{contest.contestName}</div>
                      <div className="contest-cell">{contest.ranking}</div>
                      <div className="contest-cell">{contest.score}</div>
                      <div className={`contest-cell rating-change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '+' : ''}{ratingChange.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="activity-insights-card">
            <h3>Activity Insights</h3>
            <div className="insights-grid">
              <div className="insight-item">
                <div className="insight-icon">🔥</div>
                <div className="insight-value">{userInfo.last7DaysActivity}</div>
                <div className="insight-label">Problems Last 7 Days</div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">📊</div>
                <div className="insight-value">{userInfo.last30DaysActivity}</div>
                <div className="insight-label">Problems Last 30 Days</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo; 