import React from 'react';

function Home() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h1>Welcome to the Chat Box</h1>
                <p>Please log in or register to start chatting.</p>
                <div className="mt-3">
                    <a href="/login" className="btn btn-outline-primary me-2">Login</a>
                    <a href="/register" className="btn btn-primary">Register</a>
                </div>
            </div>
        </div>
    );
}


export default Home;
