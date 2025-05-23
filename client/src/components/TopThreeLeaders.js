import React from 'react';
import './TopThreeLeaders.css';
import crownImage from '../assets/images/crown.png';

const TopThreeLeaders = ({ leaders }) => {
  // If there are no leaders, return null
  if (!leaders || leaders.length === 0) {
    return null;
  }

  // Get up to 3 leaders
  const topLeaders = leaders.slice(0, 3);

  // Medal icons
  const medalIcons = {
    1: <span className="medal gold-medal">🥇</span>,
    2: <span className="medal silver-medal">🥈</span>,
    3: <span className="medal bronze-medal">🥉</span>
  };

  // Profile avatar icons
  const profileIcons = {
    1: (
      <svg className="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#7C3AED" opacity="0.2"/>
        <path d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z" fill="#7C3AED"/>
        <path d="M12 13.5C9.33 13.5 4.5 14.84 4.5 17.5V18C4.5 18.55 4.95 19 5.5 19H18.5C19.05 19 19.5 18.55 19.5 18V17.5C19.5 14.84 14.67 13.5 12 13.5Z" fill="#7C3AED"/>
      </svg>
    ),
    2: (
      <svg className="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#A78BFA" opacity="0.2"/>
        <path d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z" fill="#A78BFA"/>
        <path d="M12 13.5C9.33 13.5 4.5 14.84 4.5 17.5V18C4.5 18.55 4.95 19 5.5 19H18.5C19.05 19 19.5 18.55 19.5 18V17.5C19.5 14.84 14.67 13.5 12 13.5Z" fill="#A78BFA"/>
      </svg>
    ),
    3: (
      <svg className="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#C4B5FD" opacity="0.2"/>
        <path d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z" fill="#C4B5FD"/>
        <path d="M12 13.5C9.33 13.5 4.5 14.84 4.5 17.5V18C4.5 18.55 4.95 19 5.5 19H18.5C19.05 19 19.5 18.55 19.5 18V17.5C19.5 14.84 14.67 13.5 12 13.5Z" fill="#C4B5FD"/>
      </svg>
    )
  };

  // Render a podium position
  const PodiumPosition = ({ leader, position }) => {
    if (!leader) return null;

    const positionClasses = {
      1: 'first-place',
      2: 'second-place',
      3: 'third-place'
    };

    return (
      <div className={`podium-position ${positionClasses[position]}`}>
        <div className="player-card">
          <div className={`crown animated-crown crown-${position}`}>
            <img 
              src={crownImage} 
              alt="Crown" 
              className="crown-image"
            />
          </div>
          <div className="avatar">
            {profileIcons[position]}
          </div>
          <div className="player-info">
            <h3 className="player-name" title={leader.name}>{leader.name}</h3>
            <p className="player-username" title={leader.username}>@{leader.username}</p>
            <div className="player-rating">{leader.rating}</div>
          </div>
          <div className="medal-container">
            {medalIcons[position]}
          </div>
        </div>
        <div className="podium-block"></div>
      </div>
    );
  };

  // Function to get the appropriate layout class based on number of leaders
  const getLayoutClass = () => {
    switch (topLeaders.length) {
      case 1:
        return 'single-leader';
      case 2:
        return 'two-leaders';
      default:
        return 'three-leaders';
    }
  };

  return (
    <div className={`top-three-container ${getLayoutClass()}`}>
      <div className="animated-background">
        <div className="particles"></div>
      </div>
      <div className="podium-wrapper">
        {topLeaders.length >= 2 && (
          <PodiumPosition 
            leader={topLeaders[1]} 
            position={2} 
          />
        )}
        <PodiumPosition 
          leader={topLeaders[0]} 
          position={1} 
        />
        {topLeaders.length >= 3 && (
          <PodiumPosition 
            leader={topLeaders[2]} 
            position={3} 
          />
        )}
      </div>
    </div>
  );
};

export default TopThreeLeaders; 