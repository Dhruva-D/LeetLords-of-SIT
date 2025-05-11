import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <h1 onClick={() => window.location.href='/'}>
            LeetLords
          </h1>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={menuOpen ? 'active' : ''}>
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
      </div>
    </header>
  );
};

export default Header; 