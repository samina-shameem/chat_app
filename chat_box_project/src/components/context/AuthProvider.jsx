import React, { createContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext({});

// Define the provider component
export const AuthProvider = ({ children }) => {
  // Load authentication data from localStorage or initialize with default values
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : {
      username: "",
      password: "",
      accessToken: "",
      userID: "",
      avatar: "",
      userList: []
    };
  });

  // Save authentication data to localStorage whenever it changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  // Login function
  const login = (authData) => {
    console.info('Logging in with:', authData);
    setAuth(authData);
  };

  // Set user details function
  const setUserDetails = (userData) => {
    if (auth && userData) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        ...userData,
      }));
    } else {
      console.error("setUserDetails: auth or userData is null or undefined");
    }
  };

  // Logout function
  const logout = () => {
    console.info('Logging out');
    setAuth(null);
  };

  // Provide context values
  return (
    <AuthContext.Provider value={{ auth, login, logout, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
