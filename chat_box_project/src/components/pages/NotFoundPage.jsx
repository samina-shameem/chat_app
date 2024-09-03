import React from 'react';

import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h2>404 Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <div className="mt-3">
                    <Link to="/" className="btn btn-primary">Go to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
