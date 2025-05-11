import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Toggle body scroll when menu is open
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close menu when route changes
  useEffect(() => {
    document.body.style.overflow = '';
    setMenuOpen(false);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [location.pathname]);

  // Handle clicks outside the menu to close it
  const handleOutsideClick = (e) => {
    const nav = document.querySelector('nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
      setMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  // Add event listener when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header className={`header ${menuOpen ? 'menu-open' : ''}`}>
      <div className="header-content">
        <div className="logo-container">
          <h1 onClick={() => window.location.href='/'}>
            LeetLords
          </h1>
        </div>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={menuOpen ? 'active' : ''}>
          <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''} onClick={handleLinkClick}>
            Leaderboard
          </Link>
          <Link to="/userinfo" className={location.pathname === '/userinfo' ? 'active' : ''} onClick={handleLinkClick}>
            User Info
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={handleLinkClick}>
            About
          </Link>
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''} onClick={handleLinkClick}>
            Register
          </Link>
        </nav>
        
        {menuOpen && <div className="menu-overlay" onClick={handleLinkClick}></div>}
      </div>
    </header>
  );
};

export default Header; 