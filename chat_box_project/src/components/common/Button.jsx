import React from 'react';

function Button({ children, onClick, type = 'button', className = 'btn btn-primary' }) {
    return (
        <button type={type} className={className} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
