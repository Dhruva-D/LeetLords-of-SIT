import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './UserInfo.css';
import config from '../config';

// Create axios instance with explicit backend URL and timeout
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout, // Use configured timeout
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
      
      // Debug log to verify API response structure
      console.log("API Response:", response.data);
      
      // Process the data
      const userData = response.data.userData || {};
      const contestData = response.data.userContestDetails || {};
      const recentSubmissions = response.data.recentSubmissions || [];
      
      // Debug logs for contest data
      console.log("Contest Data:", contestData);
      console.log("Contest Ranking History:", contestData.userContestRankingHistory);
      
      // Calculate solved problems by difficulty
      // First check if we have allQuestionsCount for total available problems
      const allQuestions = userData.allQuestionsCount || [];
      const totalAvailable = {
        all: allQuestions.find(q => q.difficulty === "All")?.count || 0,
        easy: allQuestions.find(q => q.difficulty === "Easy")?.count || 0,
        medium: allQuestions.find(q => q.difficulty === "Medium")?.count || 0,
        hard: allQuestions.find(q => q.difficulty === "Hard")?.count || 0
      };
      
      // Then get the solved problems from submitStats
      const submitStats = userData.matchedUser?.submitStats || {};
      const acSubmissions = submitStats.acSubmissionNum || [];
      const totalSubmissions = submitStats.totalSubmissionNum || [];
      
      const problemStats = {
        total: acSubmissions.find(s => s.difficulty === "All")?.count || 0,
        easy: acSubmissions.find(s => s.difficulty === "Easy")?.count || 0,
        medium: acSubmissions.find(s => s.difficulty === "Medium")?.count || 0,
        hard: acSubmissions.find(s => s.difficulty === "Hard")?.count || 0,
        totalAvailable: totalAvailable,
        acceptanceRate: calculateAcceptanceRate(acSubmissions, totalSubmissions)
      };
      
      // Process contest history
      const contestHistory = contestData.userContestRanking?.attendedContestsCount || 0;
      const contestRating = contestData.userContestRanking?.rating?.toFixed(2) || 'N/A';
      const globalRank = contestData.userContestRanking?.globalRanking || 'N/A';
      const topPercentage = contestData.userContestRanking?.topPercentage?.toFixed(2) || 'N/A';
      
      // Get recent contests (last 5)
      let recentContests = [];
      if (contestData.userContestRankingHistory && Array.isArray(contestData.userContestRankingHistory)) {
        recentContests = contestData.userContestRankingHistory
          .filter(contest => contest.attended)
          .slice(0, 5);
      }
      
      // Process contest data for display
      const processedContests = recentContests.map((contest, index, arr) => {
        // Extract contest name from the nested structure
        let contestName = 'Unknown Contest';
        if (contest.contest && contest.contest.title) {
          contestName = contest.contest.title;
        } else if (contest.contestName) {
          contestName = contest.contestName;
        }
        
        // Extract other contest data
        const ranking = contest.ranking || 'N/A';
        const score = contest.score || 0;
        const problemsSolved = contest.problemsSolved || 0;
        const totalProblems = contest.totalProblems || 0;
        
        // Calculate rating change compared to previous contest
        let ratingChange = '0.00';
        if (index < arr.length - 1 && contest.rating && arr[index + 1].rating) {
          ratingChange = (contest.rating - arr[index + 1].rating).toFixed(2);
        }
        
        return {
          contestName,
          ranking,
          score,
          ratingChange,
          problemsSolved,
          totalProblems
        };
      });
      
      // Calculate best rank
      let bestRank = Number.MAX_SAFE_INTEGER;
      let bestContestName = '';
      
      if (contestData.userContestRankingHistory) {
        contestData.userContestRankingHistory.forEach(contest => {
          if (contest.attended && contest.ranking && contest.ranking < bestRank) {
            bestRank = contest.ranking;
            bestContestName = contest.contest?.title || '';
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
      
      // Process submission calendar if available
      if (userData.matchedUser?.submissionCalendar) {
        try {
          const calendar = JSON.parse(userData.matchedUser.submissionCalendar);
          const now = Date.now() / 1000; // Current time in seconds
          
          Object.entries(calendar).forEach(([timestamp, count]) => {
            const submissionTime = parseInt(timestamp);
            const secondsInDay = 86400; // 24 * 60 * 60
            
            // Check if submission is within last 30 days
            if (now - submissionTime <= 30 * secondsInDay) {
              last30DaysActivity += parseInt(count);
              
              // Check if submission is within last 7 days
              if (now - submissionTime <= 7 * secondsInDay) {
                last7DaysActivity += parseInt(count);
              }
            }
          });
        } catch (e) {
          console.error("Error parsing submission calendar:", e);
        }
      } else {
        // Fallback to processing recent submissions if calendar not available
        if (recentSubmissions && recentSubmissions.length > 0) {
          // Create a Set to track unique problem IDs solved in each time period
          const last7DaysProblems = new Set();
          const last30DaysProblems = new Set();
          
          recentSubmissions.forEach(submission => {
            if (submission.statusDisplay === 'Accepted') {
              const submissionDate = new Date(submission.timestamp * 1000);
              const problemId = submission.titleSlug;
              
              if (submissionDate >= thirtyDaysAgo) {
                last30DaysProblems.add(problemId);
                
                if (submissionDate >= sevenDaysAgo) {
                  last7DaysProblems.add(problemId);
                }
              }
            }
          });
          
          last7DaysActivity = last7DaysProblems.size;
          last30DaysActivity = last30DaysProblems.size;
        }
      }
      
      // Get profile details
      const profile = userData.matchedUser?.profile || {};
      const realName = profile.realName || userToFetch;
      const profilePicture = profile.userAvatar || null;
      const countryName = profile.countryName || null;
      const skillTags = profile.skillTags || [];
      const starRating = profile.starRating || 0;
      const company = profile.company || null;
      const school = profile.school || null;
      
      // Get badges
      const badges = userData.matchedUser?.badges || [];
      const activeBadge = userData.matchedUser?.activeBadge || null;
      
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
        realName,
        profilePicture,
        countryName,
        skillTags,
        starRating,
        company,
        school,
        problemStats,
        contestHistory,
        contestRating,
        globalRank,
        topPercentage,
        recentContests,
        processedContests,
        bestRank: bestRank === Number.MAX_SAFE_INTEGER ? 'N/A' : bestRank,
        bestContestName,
        last30DaysActivity,
        last7DaysActivity,
        badges,
        activeBadge,
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

  // Helper function to calculate acceptance rate
  const calculateAcceptanceRate = (acSubmissions, totalSubmissions) => {
    const acAll = acSubmissions.find(s => s.difficulty === "All");
    const totalAll = totalSubmissions.find(s => s.difficulty === "All");
    
    if (acAll && totalAll && totalAll.submissions > 0) {
      return ((acAll.submissions / totalAll.submissions) * 100).toFixed(1);
    }
    
    return "0.0";
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
                
                {/* Additional user information */}
                <div className="additional-info">
                  {userInfo.countryName && (
                    <div className="info-item">
                      <span className="info-icon">🌍</span>
                      <span>{userInfo.countryName}</span>
                    </div>
                  )}
                  {userInfo.school && (
                    <div className="info-item">
                      <span className="info-icon">🎓</span>
                      <span>{userInfo.school}</span>
                    </div>
                  )}
                  {userInfo.company && (
                    <div className="info-item">
                      <span className="info-icon">💼</span>
                      <span>{userInfo.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {userInfo.skillTags && userInfo.skillTags.length > 0 && (
              <div className="skills-container">
                <div className="skills-title">Skills</div>
                <div className="skills-tags">
                  {userInfo.skillTags.map((skill, index) => (
                    <div key={index} className="skill-tag">{skill}</div>
                  ))}
                </div>
              </div>
            )}
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
                <div className="total-available">
                  out of {userInfo.problemStats.totalAvailable.all} available
                </div>
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
                      style={{ width: `${calculatePercentage(userInfo.problemStats.easy, userInfo.problemStats.totalAvailable.easy)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">
                    {userInfo.problemStats.easy} / {userInfo.problemStats.totalAvailable.easy}
                  </div>
                </div>
                <div className="difficulty-item">
                  <div className="difficulty-label medium">
                    <span className="difficulty-dot"></span>
                    Medium
                  </div>
                  <div className="difficulty-bar-container">
                    <div 
                      className="difficulty-bar medium" 
                      style={{ width: `${calculatePercentage(userInfo.problemStats.medium, userInfo.problemStats.totalAvailable.medium)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">
                    {userInfo.problemStats.medium} / {userInfo.problemStats.totalAvailable.medium}
                  </div>
                </div>
                <div className="difficulty-item">
                  <div className="difficulty-label hard">
                    <span className="difficulty-dot"></span>
                    Hard
                  </div>
                  <div className="difficulty-bar-container">
                    <div 
                      className="difficulty-bar hard" 
                      style={{ width: `${calculatePercentage(userInfo.problemStats.hard, userInfo.problemStats.totalAvailable.hard)}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-count">
                    {userInfo.problemStats.hard} / {userInfo.problemStats.totalAvailable.hard}
                  </div>
                </div>
              </div>
              
              {/* Problem solving distribution visualization */}
              <div className="problem-distribution">
                <div className="distribution-title">Distribution</div>
                <div className="distribution-chart">
                  <div 
                    className="distribution-segment easy" 
                    style={{ width: `${calculatePercentage(userInfo.problemStats.easy, userInfo.problemStats.total)}%` }}
                    title={`Easy: ${userInfo.problemStats.easy} (${calculatePercentage(userInfo.problemStats.easy, userInfo.problemStats.total)}%)`}
                  ></div>
                  <div 
                    className="distribution-segment medium" 
                    style={{ width: `${calculatePercentage(userInfo.problemStats.medium, userInfo.problemStats.total)}%` }}
                    title={`Medium: ${userInfo.problemStats.medium} (${calculatePercentage(userInfo.problemStats.medium, userInfo.problemStats.total)}%)`}
                  ></div>
                  <div 
                    className="distribution-segment hard" 
                    style={{ width: `${calculatePercentage(userInfo.problemStats.hard, userInfo.problemStats.total)}%` }}
                    title={`Hard: ${userInfo.problemStats.hard} (${calculatePercentage(userInfo.problemStats.hard, userInfo.problemStats.total)}%)`}
                  ></div>
                </div>
                <div className="distribution-legend">
                  <div className="legend-item">
                    <div className="legend-color easy"></div>
                    <div className="legend-text">Easy: {calculatePercentage(userInfo.problemStats.easy, userInfo.problemStats.total)}%</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color medium"></div>
                    <div className="legend-text">Medium: {calculatePercentage(userInfo.problemStats.medium, userInfo.problemStats.total)}%</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color hard"></div>
                    <div className="legend-text">Hard: {calculatePercentage(userInfo.problemStats.hard, userInfo.problemStats.total)}%</div>
                  </div>
                </div>
              </div>
              
              {/* Acceptance rate */}
              <div className="acceptance-rate-container">
                <div className="acceptance-title">Acceptance Rate</div>
                <div className="acceptance-value">{userInfo.problemStats.acceptanceRate}%</div>
                <div className="acceptance-bar-container">
                  <div 
                    className="acceptance-bar" 
                    style={{ width: `${Math.min(100, parseFloat(userInfo.problemStats.acceptanceRate))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {userInfo.recentContests && userInfo.recentContests.length > 0 ? (
            <div className="recent-contests-card">
              <h3>Recent Contests</h3>
              <div className="contests-table">
                <div className="contests-header">
                  <div className="contest-cell">Contest</div>
                  <div className="contest-cell">Rank</div>
                  <div className="contest-cell">Score</div>
                  <div className="contest-cell">Rating Change</div>
                </div>
                {userInfo.processedContests && userInfo.processedContests.length > 0 ? (
                  userInfo.processedContests.map((contest, index) => {
                    const isPositive = parseFloat(contest.ratingChange) > 0;
                    
                    return (
                      <div key={index} className="contest-row">
                        <div className="contest-cell contest-name">{contest.contestName}</div>
                        <div className="contest-cell">{contest.ranking}</div>
                        <div className="contest-cell">
                          {contest.score}
                          {contest.problemsSolved > 0 && contest.totalProblems > 0 && 
                            ` (${contest.problemsSolved}/${contest.totalProblems})`
                          }
                        </div>
                        <div className={`contest-cell rating-change ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? '+' : ''}{contest.ratingChange}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="contest-row">
                    <div className="contest-cell" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
                      Processing contest data...
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="recent-contests-card empty-card">
              <h3>Recent Contests</h3>
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <p>No contest participation data available</p>
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
              
              {/* Star rating */}
              <div className="insight-item">
                <div className="insight-icon">⭐</div>
                <div className="insight-value">{userInfo.starRating.toFixed(1)}</div>
                <div className="insight-label">Star Rating</div>
              </div>
              
              {/* Acceptance rate */}
              <div className="insight-item">
                <div className="insight-icon">✅</div>
                <div className="insight-value">
                  {userInfo.problemStats.acceptanceRate}%
                </div>
                <div className="insight-label">Acceptance Rate</div>
              </div>
            </div>
            
            {/* Activity summary */}
            <div className="activity-summary">
              <div className="summary-title">Activity Summary</div>
              <div className="summary-text">
                Solved <strong>{userInfo.problemStats.total}</strong> problems 
                (<strong>{userInfo.problemStats.easy}</strong> easy, <strong>{userInfo.problemStats.medium}</strong> medium, <strong>{userInfo.problemStats.hard}</strong> hard)
                with <strong>{userInfo.last30DaysActivity}</strong> submissions in the last 30 days.
              </div>
            </div>
            
            {/* Badges section */}
            {userInfo.badges && userInfo.badges.length > 0 && (
              <div className="badges-container">
                <div className="badges-title">Badges</div>
                <div className="badges-grid">
                  {userInfo.badges.slice(0, 6).map((badge, index) => (
                    <div 
                      key={index} 
                      className={`badge-item ${userInfo.activeBadge && userInfo.activeBadge.id === badge.id ? 'active' : ''}`}
                      title={`${badge.displayName} - Earned on ${new Date(badge.creationDate).toLocaleDateString()}`}
                    >
                      <img 
                        src={badge.icon.startsWith('/') ? `https://leetcode.com${badge.icon}` : badge.icon} 
                        alt={badge.displayName} 
                        className="badge-icon" 
                      />
                      <div className="badge-name">{badge.displayName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo; 