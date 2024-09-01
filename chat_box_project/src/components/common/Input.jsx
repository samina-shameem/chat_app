import React from 'react';

function Input({ label, type = 'text', value, onChange, id, placeholder = '' }) {
    return (
        <div className="mb-3">
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input
                type={type}
                className="form-control"
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Input;
