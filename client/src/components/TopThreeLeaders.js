import React from 'react';
import { motion } from 'framer-motion';
import './TopThreeLeaders.css';

const TopThreeLeaders = ({ leaders }) => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Animation variants for each leader card
  const leaderVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Ensure we have exactly 3 leaders, pad with empty slots if needed
  const topThree = leaders?.slice(0, 3) || [];
  while (topThree.length < 3) {
    topThree.push({ username: 'No Player', rating: 0 });
  }

  // Reorder for podium display: [2nd, 1st, 3rd]
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  return (
    <motion.div 
      className="top-three-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {podiumOrder.map((leader, index) => {
        const podiumPosition = index === 1 ? 1 : index === 0 ? 2 : 3;
        const isWinner = podiumPosition === 1;
        
        return (
          <motion.div
            key={podiumPosition}
            className={`leader-card position-${podiumPosition}`}
            variants={leaderVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="leader-content">
              {isWinner && (
                <motion.div
                  className="crown"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👑
                </motion.div>
              )}
              <div className="avatar-container">
                <div className="avatar">
                  <span className="user-icon">👤</span>
                </div>
              </div>
              <div className="user-details">
                <span className="username">@{leader.username}</span>
                <span className="score">{Math.round(leader.rating)}</span>
              </div>
            </div>
            <div className={`podium podium-${podiumPosition}`}>
              <span className="position">{podiumPosition}</span>
            </div>
          </motion.div>
        );
      })}
      <div className="background-particles" />
    </motion.div>
  );
};

export default TopThreeLeaders; 