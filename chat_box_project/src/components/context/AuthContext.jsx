import React, { createContext, useState, useEffect } from 'react';
import { loginService, logoutService, registerService, getUserData, updateProfileService, deleteUserService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await getUserData();
            if (userData) setUser(userData);
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        const userData = await loginService(username, password);
        setUser(userData);
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const register = async (username, email, password) => {
        const userData = await registerService(username, email, password);
        setUser(userData);
    };

    const updateProfile = async (data) => {
        const updatedUser = await updateProfileService(data);
        setUser(updatedUser);
    };

    const deleteUser = async () => {
        await deleteUserService();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
