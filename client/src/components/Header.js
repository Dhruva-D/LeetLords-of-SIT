import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <h1 onClick={() => window.location.href='/'}>LeetLords</h1>
      <nav>
        <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>
          Leaderboard
        </Link>
        <Link to="/userinfo" className={location.pathname === '/userinfo' ? 'active' : ''}>
          User Info
        </Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          About
        </Link>
        <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
          Register
        </Link>
      </nav>
    </header>
  );
};

export default Header; 