import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import NotFoundPage from './components/pages/NotFoundPage';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import Unauthorized from './components/pages/Unauthorized';

import RequireAuth from './components/auth/RequireAuth';
import Chat from './components/pages/Chat';
import Dashboard from './components/pages/Dashboard';
import LogoutButton from './components/pages/LogoutButton';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />       
        
        {/* we want to protect these routes */}
        <Route element={<RequireAuth />}>
          <Route path="/chat" element={<Chat />} />        
          <Route path="/dashboard" element={<Dashboard />} />                  
        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}


export default App;