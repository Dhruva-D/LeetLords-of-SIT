import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      setIsSubmitting(true);
      
      const response = await axios.post('/api/register', {
        name,
        user: username
      });
      
      setSuccessMessage(`User "${response.data.name}" successfully registered with username "${response.data.user}".`);
      setName('');
      setUsername('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Register to Add Yourself to the Leaderboard</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            required
          />
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Your LeetCode Username"
            required
          />
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        {errorMessage && (
          <div className="message error">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="message success">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
