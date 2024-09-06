import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: "",
    password: "",
    accessToken: "",
    userID: "",
    avatar: ""
  });
  const login = (authData) => {
    console.info('Logging in with:', authData);
    setAuth(authData);
  };
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

  const logout = () => {
    console.info('Logging out');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout,setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
