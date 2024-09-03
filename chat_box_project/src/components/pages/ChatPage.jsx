import React from 'react';

import { Link } from 'react-router-dom';

function ChatPage() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h1>Welcome to the Chat Box</h1>
                <p>Login successful, site underconstruction</p>
                <div className="mt-3">
                    <Link className="btn btn-outline-primary me-2" to="/logout">Logout</Link>
                </div>
            </div>
        </div>
    );
}


export default ChatPage;
