import React from 'react';

function MessageItem({ message, deleteMessage }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>{message.content}</span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(message.id)}>Delete</button>
        </li>
    );
}

export default MessageItem;
