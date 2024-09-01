import React, { createContext, useState, useEffect } from 'react';
import { loginService, logoutService, registerService, getUserData, updateProfileService, deleteUserService } from '../../services/authService';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user data', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const userData = await loginService(username, password);
            setUser(userData);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const register = async (username, email, password) => {
        try {
            const userData = await registerService(username, email, password);
            setUser(userData);
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const updateProfile = async (data) => {
        try {
            const updatedUser = await updateProfileService(data);
            setUser(updatedUser);
        } catch (error) {
            console.error('Failed to update profile', error);
            throw error;
        }
    };

    const deleteUser = async () => {
        try {
            await deleteUserService();
            setUser(null);
        } catch (error) {
            console.error('Failed to delete user', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, deleteUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
