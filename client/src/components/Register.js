import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usn, setUsn] = useState('');
  const [usnError, setUsnError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Validate USN format
  const validateUSN = (value) => {
    // Clear previous error
    setUsnError('');
    
    if (!value) return false;
    
    // USN must start with 1SI or 4SI and follow the format
    const usnPattern = /^[14]SI\d{2}[A-Z]{2}\d{3}$/i;
    const isValid = usnPattern.test(value);
    
    if (!isValid) {
      setUsnError('USN must start with 1SI or 4SI and follow the format like 1SI23CI013');
      return false;
    }
    
    return true;
  };

  const handleUsnChange = (e) => {
    const value = e.target.value.toUpperCase();
    setUsn(value);
    
    // Validate on change but don't show error until blur
    if (value) validateUSN(value);
  };

  const handleUsnBlur = () => {
    if (usn) validateUSN(usn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate USN before submission
    if (!validateUSN(usn)) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await axios.post('/api/register', {
        name,
        user: username,
        usn
      });
      
      setSuccessMessage(`User "${response.data.name}" successfully registered with username "${response.data.user}".`);
      setName('');
      setUsername('');
      setUsn('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <motion.div 
        className="register-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-content">
          <motion.div 
            className="register-info"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="info-content">
              <h1 className="info-title">Join the LeetLords</h1>
              <p className="info-description">
                Register to track your progress, compete with peers, and showcase your LeetCode achievements on the SIT leaderboard.
              </p>
              <div className="info-features">
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <div className="feature-text">Track your ranking</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">Visualize progress</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <div className="feature-text">Improve your skills</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="form-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2>Register Account</h2>
            
            <form onSubmit={handleSubmit}>
              <motion.div
                className={`input-group ${focusedField === 'name' ? 'focused' : ''}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="input-field"
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
              
              <motion.div
                className={`input-group ${focusedField === 'username' ? 'focused' : ''}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label htmlFor="username">LeetCode Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your LeetCode username"
                  required
                  className="input-field"
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
              
              <motion.div
                className={`input-group ${focusedField === 'usn' ? 'focused' : ''} ${usnError ? 'error' : ''}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label htmlFor="usn">SIT USN</label>
                <input
                  id="usn"
                  type="text"
                  value={usn}
                  onChange={handleUsnChange}
                  onFocus={() => setFocusedField('usn')}
                  onBlur={() => {
                    setFocusedField(null);
                    handleUsnBlur();
                  }}
                  placeholder="e.g., 1SI23CI013"
                  required
                  className={`input-field ${usnError ? 'error-input' : ''}`}
                />
                <AnimatePresence>
                  {usnError && (
                    <motion.div 
                      className="usn-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {usnError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.button 
                type="submit" 
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="submit-button"
              >
                {isSubmitting ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    <span>Processing...</span>
                  </span>
                ) : (
                  'Register Now'
                )}
              </motion.button>
            </form>
            
            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  className="message error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {errorMessage}
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  className="message success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
