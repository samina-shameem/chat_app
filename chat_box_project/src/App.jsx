import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './components/context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SideNav from './components/layout/SideNav';
import Home from './components/pages/Home';
import NotFoundPage from './components/pages/NotFoundPage';
import RegisterPage from './components/pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <SideNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;