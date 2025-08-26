import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import AIChatPage from './pages/AIChatPage';
import HomePage from './pages/HomePage';
import UploadMedicine from './pages/UploadMedicine';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/ai-chat" element={isAuthenticated ? <AIChatPage /> : <Navigate to="/login" />} />
        <Route path="/upload" element={isAuthenticated ? <UploadMedicine /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
