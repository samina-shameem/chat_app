import React from 'react';

import { Link } from 'react-router-dom';

function SideNav() {
    return (
        <aside className="bg-light p-3">
            <h4>Menu</h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/chat">Chat</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>
            </ul>
        </aside>
    );
}

export default SideNav;
