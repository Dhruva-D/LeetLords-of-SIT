import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [normalLeaderboard, setNormalLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [weeklyTitle, setWeeklyTitle] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard');
        console.log('API Response:', response.data);
        
        setNormalLeaderboard(response.data.normalLeaderboard || []);
        setWeeklyLeaderboard(response.data.weeklyLeaderboard || []);
        
        console.log('Weekly Leaderboard:', response.data.weeklyLeaderboard);
        
        if (response.data.weeklyLeaderboard && response.data.weeklyLeaderboard.length > 0) {
          setWeeklyTitle(response.data.weeklyLeaderboard[0].title || '');
          setWeeklyTime(response.data.weeklyLeaderboard[0].time || '');
          console.log('Weekly Title:', response.data.weeklyLeaderboard[0].title);
          console.log('Weekly Time:', response.data.weeklyLeaderboard[0].time);
        } else {
          console.log('No weekly leaderboard data available');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to fetch leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  // Log render variables
  console.log('Rendering with weekly data:', {
    weeklyLeaderboard,
    weeklyLeaderboardLength: weeklyLeaderboard.length,
    weeklyTitle,
    weeklyTime
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="leaderboards-container">
      {/* Normal Leaderboard */}
      <div className="content">
        <h2>LeetCode Leaderboard</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SIT Rank</th>
                <th>Global Rank</th>
                <th>Name</th>
                <th>Username</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {normalLeaderboard.map((user, index) => (
                <tr key={`normal-${user.username}`}>
                  <td>{index + 1}</td>
                  <td>{user.rank}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Leaderboard - without conditional rendering for debugging */}
      <div className="content">
        <h2>
          Weekly Contest Leaderboard {weeklyTitle ? `- ${weeklyTitle}` : ''} 
          {weeklyTime ? `(${weeklyTime})` : ''}
        </h2>
        <div className="table-container">
          {weeklyLeaderboard.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>SIT Rank</th>
                  <th>Global Rank</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Rating</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {weeklyLeaderboard.map((user, index) => (
                  <tr key={`weekly-${user.username}`}>
                    <td>{index + 1}</td>
                    <td>{user.rank}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.rating}</td>
                    <td>{user.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No weekly contest data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 