import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="content">
        <h2>About LeetLords</h2>
        <div className="about-sections">
          <section className="about-section">
            <h3>Our Mission</h3>
            <p>
              LeetLords is dedicated to fostering competitive programming excellence among SIT students. 
              We provide a dynamic platform that tracks and celebrates coding achievements through LeetCode performance.
            </p>
          </section>

          <section className="about-section">
            <h3>Features</h3>
            <ul>
              <li>SIT Rankings Leaderboard</li>
              <li>Weekly Contest Performance</li>
              <li>Personal Performance Tracking</li>
              <li>Real-time Data Updates</li>
              <li>Contest History and Analytics</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>How It Works</h3>
            <p>
              Our platform automatically syncs with LeetCode's API to track participants' progress. 
              Rankings are updated regularly to reflect recent achievements in both global performance 
              and weekly contests.
            </p>
          </section>

          <section className="about-section">
            <h3>Join Us</h3>
            <p>
              Are you a SIT student passionate about coding? Register with your LeetCode username 
              to join our community and start competing with your peers!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 