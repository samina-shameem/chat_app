import React from 'react';

function NotFoundPage() {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h2>404 Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <div className="mt-3">
                    <a href="/" className="btn btn-primary">Go to Home</a>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
