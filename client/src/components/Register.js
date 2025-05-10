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
    <motion.div 
      className="register-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="form-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>Register to Add Yourself to the Leaderboard</h2>
        
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              required
              className="input-field"
            />
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Your LeetCode Username"
              required
              className="input-field"
            />
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="usn-input-container"
          >
            <input
              type="text"
              value={usn}
              onChange={handleUsnChange}
              onBlur={handleUsnBlur}
              placeholder="Enter Your SIT USN (e.g., 1SI23CI013)"
              required
              className={`input-field ${usnError ? 'error-input' : ''}`}
            />
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
          </motion.div>
          
          <motion.button 
            type="submit" 
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
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
    </motion.div>
  );
};

export default Register;
