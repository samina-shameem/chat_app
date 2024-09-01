let messages = [
    { id: 1, content: 'Hello!' },
    { id: 2, content: 'How are you?' }
];

export const fetchMessagesService = async () => {
    // Mocked fetch messages service
    return messages;
};

export const sendMessageService = async (content) => {
    // Mocked send message service
    const newMessage = { id: messages.length + 1, content };
    messages.push(newMessage);
    return newMessage;
};

export const deleteMessageService = async (id) => {
    // Mocked delete message service
    messages = messages.filter((message) => message.id !== id);
};
