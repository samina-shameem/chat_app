import React from 'react';

import { Link } from 'react-router-dom';
import LogoutButton from '../pages/LogoutButton';

function SideNav() {
    return (
        <aside className="bg-light p-3">
            <h4></h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <LogoutButton />
                </li>
            </ul>
        </aside>
    );
}

export default SideNav;
