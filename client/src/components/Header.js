import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setMenuOpen(!menuOpen);
    // Toggle body class for overflow and fixed content
    if (!menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Close menu when route changes
  useEffect(() => {
    document.body.classList.remove('menu-open');
    setMenuOpen(false);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [location.pathname]);

  // Handle clicks outside the menu to close it
  const handleOutsideClick = (e) => {
    if (
      navRef.current && 
      toggleRef.current && 
      !navRef.current.contains(e.target) && 
      !toggleRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
      document.body.classList.remove('menu-open');
    }
  };

  // Add event listener when menu is open
  useEffect(() => {
    if (menuOpen) {
      // Small delay to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 100);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
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
          ref={toggleRef}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={menuOpen ? 'active' : ''} ref={navRef}>
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