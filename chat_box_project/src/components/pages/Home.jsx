import React from 'react';

import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h1>Welcome to the Chat Box</h1>
                <p>Please log in or register to start chatting.</p>
                <div className="mt-3">
                    <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                    <Link className="btn btn-primary" to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}


export default Home;
