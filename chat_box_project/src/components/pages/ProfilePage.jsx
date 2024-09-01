import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
    const { user, updateProfile, deleteUser } = useAuth();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatar);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateProfile({ username, email, avatar });
    };

    return (
        <div className="container">
            <h2>Profile</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="avatar" className="form-label">Avatar URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="avatar"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
                <button type="button" className="btn btn-danger" onClick={deleteUser}>Delete Account</button>
            </form>
        </div>
    );
}

export default ProfilePage;
