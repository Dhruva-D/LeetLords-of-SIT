import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import About from './components/About';
import Register from './components/Register';
import UserInfo from './components/UserInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/leaderboard" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="*" element={<Navigate to="/leaderboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 