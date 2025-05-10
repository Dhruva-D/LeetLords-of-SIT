import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';

// Create axios instance with explicit backend URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setUserInfo(null);

    try {
      const response = await api.get(`/api/user/${username}`);
      const processedData = {
        ...response.data,
        rating: response.data.rating ? Number(response.data.rating).toFixed(2) : 'N/A',
        contestRating: response.data.contestRating ? Number(response.data.contestRating).toFixed(2) : 'N/A'
      };
      setUserInfo(processedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
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
            <h3>Profile Details</h3>
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