import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import About from './components/About';
import Register from './components/Register';
import UserInfo from './components/UserInfo';
import ApiDebug from './components/ApiDebug';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserInfo />} />
          <Route path="/debug" element={<ApiDebug />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 