import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate"; 
import useAuth from "../hooks/useAuth";
import { Button, Form } from "react-bootstrap";

const Chat = () => {
  const axiosPrivate = useAxiosPrivate(); // Authenticated Axios instance
  const { auth } = useAuth(); // Logged-in user's info
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosPrivate.get("/messages");
        if (!response || !response.data) {
          throw new Error("Failed to fetch messages");
        }
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages", err);
        setError("Could not load messages. Please try again.");
      }
    };
    fetchMessages();
  }, [axiosPrivate]);

  // Handle new message creation
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    try {
      const response = await axiosPrivate.post("/messages", {
        text: newMessage.trim(),
        conversationId: "{% uuid %}" // Replace with actual conversation logic
      });
      if (!response || !response.data) {
        throw new Error("Failed to send message");
      }
      setMessages([...messages, response.data]); // Add new message to state
      setNewMessage(""); // Clear input after sending
    } catch (err) {
      console.error("Error sending message", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (id) => {
    if (!id) {
      console.error("No message ID provided");
      return;
    }
    try {
      const response = await axiosPrivate.delete(`/messages/${id}`);
      if (!response || !response.data) {
        throw new Error("Failed to delete message");
      }
      setMessages(messages.filter((message) => message.id !== id)); // Remove deleted message from state
    } catch (err) {
      console.error("Error deleting message", err);
      setError("Failed to delete message. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="messages-container">
        {messages.map((message) => {
          if (!message) {
            console.error("No message found");
            return null;
          }
          return (
            <div
              key={message.id}
              className={`message-item ${message.userId === auth?.userId ? "right" : "left"}`}
            >
              <p>{message.text}</p>
              <small>{new Date(message.createdAt).toLocaleString()}</small>
              {message.userId === auth?.userId && (
                <Button variant="danger" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                  Delete
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <Form.Group className="mt-3">
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button className="mt-2" variant="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Form.Group>
    </div>
  );
};

export default Chat;

