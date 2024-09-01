import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageList from '../chat/MessageList';

function ChatPage() {
    const { messages, fetchMessages, sendMessage, deleteMessage } = useChat();

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="container">
            <h2>Chat</h2>
            <MessageList messages={messages} deleteMessage={deleteMessage} />
            <form onSubmit={(e) => {
                e.preventDefault();
                sendMessage(e.target.elements.message.value);
                e.target.reset();
            }}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" name="message" placeholder="Type a message..." />
                    <button className="btn btn-primary" type="submit">Send</button>
                </div>
            </form>
        </div>
    );
}

export default ChatPage;
