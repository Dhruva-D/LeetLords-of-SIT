import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

// Cache constants
const CACHE_KEY = 'leaderboardData';
const CACHE_TIMESTAMP_KEY = 'leaderboardTimestamp';
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

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
  const [lastUpdated, setLastUpdated] = useState(null);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Load data from localStorage
  const loadCachedData = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cachedTimestamp) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp, 10);
        setLastUpdated(new Date(timestamp));
        return { data: parsedData, timestamp };
      }
    } catch (err) {
      console.error('Error loading cached data:', err);
    }
    return null;
  }, []);

  // Save data to localStorage
  const saveDataToCache = useCallback((data) => {
    try {
      const now = new Date().getTime();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
      setLastUpdated(new Date(now));
    } catch (err) {
      console.error('Error saving data to cache:', err);
    }
  }, []);

  // Check if cache is expired
  const isCacheExpired = useCallback(() => {
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!cachedTimestamp) return true;
    
    const now = new Date().getTime();
    const timestamp = parseInt(cachedTimestamp, 10);
    return now - timestamp > CACHE_DURATION;
  }, []);

  const fetchLeaderboards = useCallback(async (forceRefresh = false, currentRetry = 0) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = loadCachedData();
        if (cachedData && cachedData.data) {
          console.log('Using cached leaderboard data');
          processLeaderboardData(cachedData.data);
          setLoading(false);
          setRefreshing(false);
          
          // If cache is expired, trigger a background refresh
          if (isCacheExpired()) {
            console.log('Cache expired, fetching fresh data in background');
            fetchLeaderboards(true, 0);
          }
          return;
        }
      }

      // Fetch fresh data from API with increased timeout
      console.log(`Fetching fresh leaderboard data (attempt ${currentRetry + 1}/${MAX_RETRIES + 1})`);
      const response = await axios.get('/api/leaderboard', {
        timeout: INITIAL_TIMEOUT + (currentRetry * 5000) // Increase timeout with each retry
      });
      
      // Save to localStorage cache
      saveDataToCache(response.data);
      
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
  }, [loadCachedData, saveDataToCache, isCacheExpired]);

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

  // Set up auto-refresh timer
  useEffect(() => {
    // Check for expired cache and refresh if needed on component mount
    const checkAndRefreshCache = () => {
      if (isCacheExpired()) {
        console.log('Cache expired, fetching fresh data');
        fetchLeaderboards(true);
      }
    };

    // Set up interval to check cache every hour
    const intervalId = setInterval(checkAndRefreshCache, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, [fetchLeaderboards, isCacheExpired]);

  // Initial load from cache on component mount
  useEffect(() => {
    const cachedData = loadCachedData();
    
    if (cachedData && cachedData.data) {
      processLeaderboardData(cachedData.data);
      setLoading(false);
      
      // If cache is expired, fetch in background
      if (isCacheExpired()) {
        fetchLeaderboards(true);
      }
    } else {
      // No cache available, fetch new data
      fetchLeaderboards(false);
    }
  }, [fetchLeaderboards, loadCachedData, isCacheExpired]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRetryCount(0); // Reset retry count on manual refresh
    fetchLeaderboards(true);
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleString();
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
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <button 
            className="refresh-button" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {formatLastUpdated()}
          </div>
        )}
        
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
                    <td>{user.usn || '-'}</td>
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