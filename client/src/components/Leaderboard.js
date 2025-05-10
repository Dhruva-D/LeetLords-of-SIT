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

const Leaderboard = () => {
  const [normalLeaderboard, setNormalLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [weeklyTitle, setWeeklyTitle] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchLeaderboards = useCallback(async (forceRefresh = false) => {
    try {
      // If refreshing, show the refreshing state instead of full loading
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check if we have valid cached data and not forcing refresh
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

      // Fetch fresh data from API
      console.log('Fetching fresh leaderboard data');
      const response = await axios.get('/api/leaderboard', {
        timeout: 10000 // 10 second timeout
      });
      
      // Update the cache
      apiCache.data = response.data;
      apiCache.timestamp = now;
      
      // Process the data
      processLeaderboardData(response.data);
      
      setLoading(false);
      setRefreshing(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to fetch leaderboard data');
      setLoading(false);
      setRefreshing(false);
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

  // Determine which leaderboard to show based on the current route
  const isWeeklyRoute = location.pathname === '/weekly';
  const currentLeaderboard = isWeeklyRoute ? weeklyLeaderboard : normalLeaderboard;
  const title = isWeeklyRoute ? `Weekly Contest Leaderboard ${weeklyTitle ? `- ${weeklyTitle}` : ''} ${weeklyTime ? `(${weeklyTime})` : ''}` : 'Global Rankings';

  return (
    <div className="leaderboards-container">
      <div className="content">
        <div className="leaderboard-header">
          <h2>{title}</h2>
          <button 
            className={`refresh-button ${refreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
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
                  {isWeeklyRoute && <th>Trend</th>}
                </tr>
              </thead>
              <tbody>
                {currentLeaderboard.map((user, index) => (
                  <tr key={`${isWeeklyRoute ? 'weekly' : 'normal'}-${user.username}`}>
                    <td>{index + 1}</td>
                    <td>{user.rank}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.usn}</td>
                    <td>{user.rating}</td>
                    {isWeeklyRoute && <td>{user.trend}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No {isWeeklyRoute ? 'weekly contest' : 'leaderboard'} data available</p>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 