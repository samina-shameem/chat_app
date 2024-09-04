import React from 'react';

import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Dashboard() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h1>Welcome to the Chat Box</h1>
                <p>Login successful, Dashboard is underconstruction</p>
                <LogoutButton />
            </div>
        </div>
    );
}


export default Dashboard;
