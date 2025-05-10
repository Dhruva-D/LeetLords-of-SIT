import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './UserInfo.css';

// Create a cache for user data
const userCache = {
  data: {},
  timestamps: {},
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Create axios instance with explicit backend URL and timeout
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 8000, // 8 second timeout
  withCredentials: false
});

const UserInfo = () => {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState({ status: 'unknown', route: null });

  // Check API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  // Function to test if the API is working
  const testApiConnection = async () => {
    try {
      const response = await api.get('/api/test');
      setApiInfo({ status: 'connected', route: 'main', details: response.data });
      return true;
    } catch (error) {
      setApiInfo({ 
        status: 'error', 
        route: null, 
        error: error.message 
      });
      return false;
    }
  };

  const fetchUserData = useCallback(async (userToFetch, forceRefresh = false) => {
    if (!userToFetch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Check if we have cached data for this user and it's still valid
      const now = new Date().getTime();
      if (!forceRefresh && 
          userCache.data[userToFetch] && 
          userCache.timestamps[userToFetch] && 
          (now - userCache.timestamps[userToFetch] < userCache.CACHE_DURATION)) {
        console.log(`Using cached data for user: ${userToFetch}`);
        setUserInfo(userCache.data[userToFetch]);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      console.log(`Fetching fresh data for user: ${userToFetch}`);
      const response = await api.get(`/api/user/${userToFetch}`);
      
      const processedData = {
        ...response.data,
        rating: response.data.rating ? Number(response.data.rating).toFixed(2) : 'N/A',
        contestRating: response.data.contestRating ? Number(response.data.contestRating).toFixed(2) : 'N/A'
      };
      
      // Update the cache
      userCache.data[userToFetch] = processedData;
      userCache.timestamps[userToFetch] = now;
      
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

  const handleRefresh = () => {
    if (userInfo) {
      fetchUserData(username, true);
    }
  };

  return (
    <div className="user-info-container">
      <div className="user-info-content">
        <h2>User Information</h2>
        
        <div className={`api-status ${apiInfo.status}`}>
          <span>API Status: {apiInfo.status}</span>
        </div>

        <form onSubmit={handleSubmit} className="user-search-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode Username"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Try usernames like: "zhenya_", "vitalii_v", or check if LeetCode API is available.</p>
          </div>
        )}

        {userInfo && (
          <div className="user-details">
            <div className="user-details-header">
              <h3>Profile Details</h3>
              <button 
                className="refresh-button" 
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Global Rank</div>
                <div className="stat-value">{userInfo.rank || 'N/A'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Rating</div>
                <div className="stat-value">{userInfo.rating}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Contest Rating</div>
                <div className="stat-value">{userInfo.contestRating}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Problems Solved</div>
                <div className="stat-value">{userInfo.problemsSolved || 'N/A'}</div>
              </div>
            </div>

            {userInfo.recentContests && userInfo.recentContests.length > 0 && (
              <>
                <h3>Recent Contests</h3>
                <div className="stats-grid">
                  {userInfo.recentContests.map((contest, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-label">{contest.name}</div>
                      <div className="stat-value">Rank: {contest.rank}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo; 