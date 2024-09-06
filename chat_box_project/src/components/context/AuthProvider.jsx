import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: "samina",
    password: "12345",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMxMCwidXNlciI6InNhbWluYSIsImVtYWlsIjoic2FtaW5hQGdtYWlsLmNvbSIsImF2YXRhciI6IiIsImludml0ZSI6bnVsbCwiaWF0IjoxNzI1NTY5Nzk1LCJleHAiOjE3MjU1NzMzOTV9.lvOHZJpo4hnARBkGYeKZv2Kfb3HgW5JxYU7D8fWTIh0"
  });
  const login = (authData) => {
    console.info('Logging in with:', authData);
    setAuth(authData);
  };

  const logout = () => {
    console.info('Logging out');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
