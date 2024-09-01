import React, { createContext, useState, useEffect } from 'react';
import { fetchMessagesService, sendMessageService, deleteMessageService } from '../../services/chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const fetchedMessages = await fetchMessagesService();
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, []);

    const sendMessage = async (content) => {
        try {
            const newMessage = await sendMessageService(content);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
            console.error('Failed to send message', error);
            throw error;
        }
    };

    const deleteMessage = async (id) => {
        try {
            await deleteMessageService(id);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
        } catch (error) {
            console.error('Failed to delete message', error);
            throw error;
        }
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, deleteMessage, loading }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => React.useContext(ChatContext);
