import React from 'react';

import { Link } from 'react-router-dom';
import LogoutButton from '../pages/LogoutButton';
import useAuth from '../hooks/useAuth';

function SideNav() {
    const { auth } = useAuth();
    return (
        <aside className="bg-light p-3">
            <h4></h4>
            <ul className="nav flex-column">
                {auth?.username && (
                    <li className="nav-item">
                        <LogoutButton />
                    </li>
                )}
            </ul>
        </aside>
    );
}

export default SideNav;
