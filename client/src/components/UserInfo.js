import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css'; // Reuse the leaderboard styles

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
      console.log('Testing API connection to: http://localhost:5000/api/test');
      const response = await api.get('/api/test');
      console.log('API test successful:', response.data);
      setApiInfo({ status: 'connected', route: 'main', details: response.data });
      return true;
    } catch (error) {
      console.error('API test failed:', error);
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
    setLoading(true);
    setError(null);
    setUserInfo(null);

    if (!username) {
      setError('Please enter a username');
      setLoading(false);
      return;
    }

    try {
      // First try the standard endpoint
      try {
        const url = `http://localhost:5000/api/user/info/${username}`;
        console.log(`Trying ${url}`);
        const response = await axios.get(url);
        console.log('Standard route response:', response.data);
        setUserInfo(response.data);
        setApiInfo({ status: 'success', route: 'standard' });
      } catch (err) {
        console.error('Error with standard route:', err);
        console.log('Error details:', err.response ? err.response.data : 'No response data');
        
        // Then try the direct endpoint
        try {
          const directUrl = `http://localhost:5000/api/direct/user/${username}`;
          console.log(`Trying fallback route ${directUrl}`);
          const directResponse = await axios.get(directUrl);
          console.log('Direct route response:', directResponse.data);
          setUserInfo(directResponse.data);
          setApiInfo({ status: 'success', route: 'direct' });
        } catch (directErr) {
          console.error('Error with direct route:', directErr);
          console.log('Error details:', directErr.response ? directErr.response.data : 'No response data');
          
          setError(`Failed to fetch user information. Make sure the server is running on port 5000.`);
          setApiInfo({ 
            status: 'failed', 
            route: 'both',
            error: directErr.message
          });
        }
      }
    } catch (err) {
      setError(`Failed to fetch user information: ${err.message}`);
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboards-container">
      <div className="content">
        <h2>User Information Lookup</h2>
        <div className="api-status">
          <p>API Status: <span className={`status-${apiInfo.status}`}>{apiInfo.status}</span></p>
          {apiInfo.route && <p>Route: {apiInfo.route}</p>}
          {apiInfo.error && <p>Error: {apiInfo.error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode Username"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Info'}
          </button>
        </form>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading user data for {username}...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
            <p>Try these usernames: "zhenya_", "vitalii_v", or check if LeetCode API is available.</p>
            <button onClick={testApiConnection}>Test API Connection</button>
          </div>
        )}

        {userInfo && (
          <div className="user-info">
            <h3>Contest Details for {username}</h3>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo; 