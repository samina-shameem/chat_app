import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SideNav from './components/layout/SideNav';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <SideNav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/chat" element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
