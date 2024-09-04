import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const login = (authData) => {
    setAuth(authData);
  };

  const logout = () => {
    logoutService(); // Clear tokens and any other data
    setAuth(null); // Reset authentication state
  };
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
