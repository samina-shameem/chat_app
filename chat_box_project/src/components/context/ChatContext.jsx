import React, { createContext, useState } from 'react';
import { fetchMessagesService, sendMessageService, deleteMessageService } from '../services/chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        const fetchedMessages = await fetchMessagesService();
        setMessages(fetchedMessages);
    };

    const sendMessage = async (content) => {
        const newMessage = await sendMessageService(content);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const deleteMessage = async (id) => {
        await deleteMessageService(id);
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    };

    return (
        <ChatContext.Provider value={{ messages, fetchMessages, sendMessage, deleteMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => React.useContext(ChatContext);
