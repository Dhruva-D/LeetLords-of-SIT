import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

// Create a cache object to store API responses
const apiCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes in milliseconds
};

const MAX_RETRIES = 2;
const INITIAL_TIMEOUT = 15000; // 15 seconds
const RETRY_DELAY = 1000; // 1 second delay between retries

const Leaderboard = () => {
  const [normalLeaderboard, setNormalLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [weeklyTitle, setWeeklyTitle] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const [activeView, setActiveView] = useState('all-time'); // 'all-time' or 'weekly'

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchLeaderboards = useCallback(async (forceRefresh = false, currentRetry = 0) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check cache first
      const now = new Date().getTime();
      if (!forceRefresh && 
          apiCache.data && 
          apiCache.timestamp && 
          (now - apiCache.timestamp < apiCache.CACHE_DURATION)) {
        console.log('Using cached leaderboard data');
        processLeaderboardData(apiCache.data);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch fresh data from API with increased timeout
      console.log(`Fetching fresh leaderboard data (attempt ${currentRetry + 1}/${MAX_RETRIES + 1})`);
      const response = await axios.get('/api/leaderboard', {
        timeout: INITIAL_TIMEOUT + (currentRetry * 5000) // Increase timeout with each retry
      });
      
      // Update the cache
      apiCache.data = response.data;
      apiCache.timestamp = now;
      
      // Process the data
      processLeaderboardData(response.data);
      
      setLoading(false);
      setRefreshing(false);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      
      // Implement retry logic
      if (currentRetry < MAX_RETRIES) {
        setError(`Attempt ${currentRetry + 1} failed. Retrying in ${RETRY_DELAY/1000} seconds...`);
        await delay(RETRY_DELAY);
        return fetchLeaderboards(forceRefresh, currentRetry + 1);
      }

      // If all retries failed
      const errorMessage = err.code === 'ECONNABORTED'
        ? 'Connection timeout. Please check your internet connection and try again.'
        : 'Failed to fetch leaderboard data. Please try again.';
      
      setError(errorMessage);
      setLoading(false);
      setRefreshing(false);
      setRetryCount(currentRetry + 1);
    }
  }, []);

  const processLeaderboardData = (data) => {
    // Process normal leaderboard data
    const processedNormalLeaderboard = (data.normalLeaderboard || []).map(user => ({
      ...user,
      rating: Number(user.rating).toFixed(2)
    }));
    setNormalLeaderboard(processedNormalLeaderboard);

    // Process weekly leaderboard data
    const processedWeeklyLeaderboard = (data.weeklyLeaderboard || []).map(user => ({
      ...user,
      rating: Number(user.rating).toFixed(2)
    }));
    setWeeklyLeaderboard(processedWeeklyLeaderboard);
    
    if (data.weeklyLeaderboard && data.weeklyLeaderboard.length > 0) {
      setWeeklyTitle(data.weeklyLeaderboard[0].title || '');
      setWeeklyTime(data.weeklyLeaderboard[0].time || '');
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLeaderboards();
  }, [fetchLeaderboards]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRetryCount(0); // Reset retry count on manual refresh
    fetchLeaderboards(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard data...</p>
      </div>
    );
  }

  const currentLeaderboard = activeView === 'weekly' ? weeklyLeaderboard : normalLeaderboard;

  return (
    <div className="leaderboards-container">
      <div className="content">
        <h1 className="leaderboard-title">Leaderboard</h1>
        
        <div className="toggle-container">
          <button 
            className={`toggle-button ${activeView === 'all-time' ? 'active' : ''}`}
            onClick={() => setActiveView('all-time')}
          >
            All-Time
          </button>
          <button 
            className={`toggle-button ${activeView === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveView('weekly')}
          >
            Weekly
          </button>
        </div>

        {refreshing && (
          <div className="refresh-indicator">
            <div className="refresh-spinner"></div>
            <span>Updating data...</span>
          </div>
        )}
        
        <div className="table-container">
          {currentLeaderboard.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>SIT Rank</th>
                  <th>Global Rank</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>USN</th>
                  <th>Rating</th>
                  {activeView === 'weekly' && <th>Trend</th>}
                </tr>
              </thead>
              <tbody>
                {currentLeaderboard.map((user, index) => (
                  <tr key={`${activeView}-${user.username}`}>
                    <td>{index + 1}</td>
                    <td>{user.rank}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.usn}</td>
                    <td>{user.rating}</td>
                    {activeView === 'weekly' && <td>{user.trend}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No {activeView === 'weekly' ? 'weekly contest' : 'leaderboard'} data available</p>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 