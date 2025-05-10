import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [normalLeaderboard, setNormalLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [weeklyTitle, setWeeklyTitle] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/leaderboard');
        
        // Process normal leaderboard data
        const processedNormalLeaderboard = (response.data.normalLeaderboard || []).map(user => ({
          ...user,
          rating: Number(user.rating).toFixed(2)
        }));
        setNormalLeaderboard(processedNormalLeaderboard);

        // Process weekly leaderboard data
        const processedWeeklyLeaderboard = (response.data.weeklyLeaderboard || []).map(user => ({
          ...user,
          rating: Number(user.rating).toFixed(2)
        }));
        setWeeklyLeaderboard(processedWeeklyLeaderboard);
        
        if (response.data.weeklyLeaderboard && response.data.weeklyLeaderboard.length > 0) {
          setWeeklyTitle(response.data.weeklyLeaderboard[0].title || '');
          setWeeklyTime(response.data.weeklyLeaderboard[0].time || '');
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

  // Determine which leaderboard to show based on the current route
  const isWeeklyRoute = location.pathname === '/weekly';
  const currentLeaderboard = isWeeklyRoute ? weeklyLeaderboard : normalLeaderboard;
  const title = isWeeklyRoute ? `Weekly Contest Leaderboard ${weeklyTitle ? `- ${weeklyTitle}` : ''} ${weeklyTime ? `(${weeklyTime})` : ''}` : 'Global Rankings';

  return (
    <div className="leaderboards-container">
      <div className="content">
        <h2>{title}</h2>
        <div className="table-container">
          {currentLeaderboard.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>SIT Rank</th>
                  <th>Global Rank</th>
                  <th>Name</th>
                  <th>Username</th>
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
      </div>
    </div>
  );
};

export default Leaderboard; 