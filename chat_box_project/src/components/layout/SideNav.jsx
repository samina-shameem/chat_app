import React from 'react';

function SideNav() {
    return (
        <aside className="bg-light p-3">
            <h4>Menu</h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/chat">Chat</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/profile">Profile</a>
                </li>
            </ul>
        </aside>
    );
}

export default SideNav;
