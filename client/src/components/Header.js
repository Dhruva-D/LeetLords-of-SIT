import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState('unknown');

  // Check server status periodically
  useEffect(() => {
    const checkApi = async () => {
      try {
        await axios.get('http://localhost:5000/api/test', { timeout: 2000 });
        setApiStatus('online');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    
    checkApi();
    const interval = setInterval(checkApi, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <h1 onClick={() => window.location.href='/'}>LeetLords-of-SIT</h1>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Leaderboard
        </Link>
        <Link to="/user" className={location.pathname === '/user' ? 'active' : ''}>
          User Info
        </Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          About
        </Link>
        <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
          Register
        </Link>
        <Link 
          to="/debug" 
          className={`${location.pathname === '/debug' ? 'active' : ''} ${apiStatus === 'offline' ? 'debug-alert' : ''}`}
        >
          Debug {apiStatus === 'offline' && '⚠️'}
        </Link>
      </nav>
      {apiStatus === 'offline' && (
        <div className="api-offline-alert">
          Server appears to be offline. Please visit the Debug page.
        </div>
      )}
    </header>
  );
};

export default Header; 