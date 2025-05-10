import React from 'react';
import './TopThreeLeaders.css';

const TopThreeLeaders = ({ leaders }) => {
  // If there are no leaders or less than 3, return null
  if (!leaders || leaders.length < 3) {
    return null;
  }

  // Get the top 3 leaders
  const topThree = leaders.slice(0, 3);

  // Medal icons
  const medalIcons = {
    1: <span className="medal gold-medal">🥇</span>,
    2: <span className="medal silver-medal">🥈</span>,
    3: <span className="medal bronze-medal">🥉</span>
  };

  // Crown icon using SVG
  const crownIcon = (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="crown-svg">
      <path d="M3 17L6 7L12 12L18 7L21 17H3Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21H21V19H3V21Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Render a podium position
  const PodiumPosition = ({ leader, position }) => {
    const positionClasses = {
      1: 'first-place',
      2: 'second-place',
      3: 'third-place'
    };

    return (
      <div className={`podium-position ${positionClasses[position]}`}>
        <div className="player-card">
          {position <= 3 && <div className={`crown ${position === 1 ? 'animated-crown' : ''}`}>{crownIcon}</div>}
          <div className="avatar">
            <span>{getInitials(leader.name)}</span>
          </div>
          <div className="player-info">
            <h3 className="player-name">{leader.name}</h3>
            <p className="player-username">@{leader.username}</p>
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

  return (
    <div className="top-three-container">
      <div className="animated-background">
        <div className="particles"></div>
      </div>
      <div className="podium-wrapper">
        <PodiumPosition leader={topThree[1]} position={2} />
        <PodiumPosition leader={topThree[0]} position={1} />
        <PodiumPosition leader={topThree[2]} position={3} />
      </div>
    </div>
  );
};

export default TopThreeLeaders; 