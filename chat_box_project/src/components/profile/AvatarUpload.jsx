import React, { useState } from 'react';

function AvatarUpload({ onUpload }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="mb-3">
            <input type="file" className="form-control" onChange={handleFileChange} />
            <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default AvatarUpload;
