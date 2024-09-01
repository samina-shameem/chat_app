import React from 'react';
import MessageItem from './MessageItem';

function MessageList({ messages, deleteMessage }) {
    return (
        <ul className="list-group mb-3">
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} deleteMessage={deleteMessage} />
            ))}
        </ul>
    );
}

export default MessageList;
