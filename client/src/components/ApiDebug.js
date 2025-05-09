import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const ApiDebug = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000');
  const [serverStatus, setServerStatus] = useState('unknown');
  
  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);
  
  const checkServerStatus = async () => {
    try {
      await axios.get(`${apiUrl}/api/test`, { timeout: 3000 });
      setServerStatus('online');
    } catch (error) {
      console.error('Server check failed:', error);
      setServerStatus('offline');
    }
  };
  
  const testEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    // Define the endpoints to test
    const endpoints = [
      { name: 'API Test', endpoint: '/api/test' },
      { name: 'User Test', endpoint: '/api/user/test' },
      { name: 'User Info', endpoint: '/api/user/info/dhruv_404' },
      { name: 'Direct User', endpoint: '/api/direct/user/dhruv_404' },
    ];
    
    const results = [];
    
    for (const { name, endpoint } of endpoints) {
      try {
        console.log(`Testing endpoint: ${apiUrl}${endpoint}`);
        const startTime = Date.now();
        const response = await axios.get(`${apiUrl}${endpoint}`, { timeout: 5000 });
        const endTime = Date.now();
        
        results.push({
          name,
          endpoint,
          status: 'Success',
          statusCode: response.status,
          data: response.data,
          time: `${endTime - startTime}ms`
        });
      } catch (error) {
        results.push({
          name,
          endpoint,
          status: 'Failed',
          statusCode: error.response ? error.response.status : 'Unknown',
          error: error.message,
          data: error.response ? error.response.data : null
        });
      }
    }
    
    setTestResults(results);
    setIsLoading(false);
  };
  
  // Test with direct fetch as an alternative to axios
  const testWithFetch = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/test`);
      const data = await response.json();
      
      setTestResults([
        ...testResults,
        {
          name: 'Fetch API Test',
          endpoint: '/api/test',
          status: 'Success',
          statusCode: response.status,
          data
        }
      ]);
    } catch (error) {
      setTestResults([
        ...testResults,
        {
          name: 'Fetch API Test',
          endpoint: '/api/test',
          status: 'Failed',
          error: error.message
        }
      ]);
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="leaderboards-container">
      <div className="content">
        <h2>API Debugging Tool</h2>
        <p>Server Status: <span className={`status-${serverStatus === 'online' ? 'connected' : 'error'}`}>
          {serverStatus === 'online' ? 'Online' : 'Offline or Unreachable'}
        </span></p>
        
        <div className="debug-instructions">
          <h3>Debug Instructions</h3>
          <ol>
            <li>Make sure your Express server is running on port 5000</li>
            <li>Run the tests below to check which endpoints are working</li>
            <li>Check server logs for more detailed error information</li>
            <li>Verify CORS is configured correctly on the server</li>
          </ol>
        </div>
        
        <div className="debug-controls">
          <input 
            type="text" 
            value={apiUrl} 
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="API Base URL"
          />
          <button onClick={testEndpoints} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test All Endpoints'}
          </button>
          <button onClick={testWithFetch} disabled={isLoading}>
            Test with Fetch API
          </button>
          <button onClick={checkServerStatus} disabled={isLoading}>
            Check Server Status
          </button>
        </div>
        
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Testing API endpoints...</p>
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="results-container">
            <h3>Test Results</h3>
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`result-item ${result.status === 'Success' ? 'success' : 'failure'}`}
              >
                <h4>{result.name} ({result.endpoint})</h4>
                <p>Status: <strong>{result.status}</strong> {result.statusCode && `(${result.statusCode})`}</p>
                {result.time && <p>Response time: {result.time}</p>}
                {result.error && <p>Error: {result.error}</p>}
                {result.data && (
                  <div className="data-container">
                    <p>Response Data:</p>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {serverStatus === 'offline' && testResults.length === 0 && (
          <div className="server-offline-message">
            <h3>Server appears to be offline</h3>
            <p>Please make sure your Express server is running on port 5000.</p>
            <p>Run the following command in your terminal:</p>
            <pre>cd server && node index.js</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebug; 