
import React from 'react';
// import '../assets/css/styles.css';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const GoAIChat =() => {
    navigate('/ai-chat')
  }

  return (
    <Container className="mt-4 text-center">
      <h2>Welcome to LoginApp</h2>
      <p>Please register or log in to continue.</p>

      <div className="mt-3">
        <Button variant="primary" className="mb-2" onClick={handleRegister}>Register</Button>
        <Button variant="secondary" onClick={handleLogin}>Login</Button>
        <Button variant="secondary" onClick={GoAIChat}>Go to AI Chat</Button>
      </div>
    </Container>
  );
};

export default HomePage;

