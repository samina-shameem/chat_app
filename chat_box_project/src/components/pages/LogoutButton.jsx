import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Adjust import path as needed

import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout(); // Call the logout function from context
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., show a message to the user)
    }
  };

  return (
    <Button variant="warning" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
