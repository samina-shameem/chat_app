import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate"; 
import useAuth from "../hooks/useAuth";
import { Button, Form } from "react-bootstrap";

const Chat = () => {
  const axiosPrivate = useAxiosPrivate(); 
  const { auth } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Fetching messages");
      try {
        const messagesResponse = await axiosPrivate.get("/messages");
        if (!messagesResponse || !messagesResponse.data) {
          throw new Error("Failed to fetch messages");
        }
        const messagesData = messagesResponse.data;
        console.log("Messages:", messagesData);

        const conversationsResponse = await axiosPrivate.get("/conversations");
        if (!conversationsResponse || !conversationsResponse.data) {
          throw new Error("Failed to fetch conversations");
        }
        const conversationsData = conversationsResponse.data;
        console.log("Conversations:", conversationsData);

        const messagesWithConversation = messagesData;

        const conversationsIds = conversationsData;
        console.log("Fetching messages in conversations:", conversationsIds);

        for (const id of conversationsIds) {
          const messagesResponse = await axiosPrivate.get(`/messages?conversationId=${id}`);
          if (!messagesResponse || !messagesResponse.data) {
            throw new Error("Failed to fetch messages in conversation");
          }
          const messagesInConversation = messagesResponse.data;           
          setMessages(messagesWithConversation.concat(messagesInConversation));
          console.info(messages)
        }
      } catch (err) {
        console.error("Error fetching messages", err);
        setError("Could not load messages. Please try again.");
      }
    };

    fetchMessages();
  }, [axiosPrivate]);

  return (
    <Accordion>
     {/*  {messages.map((message) => (
        <Accordion.Item eventKey={message.id} key={message.id}>
          <Accordion.Header>{message.userId}</Accordion.Header>
          <Accordion.Body>{message.text}</Accordion.Body>
        </Accordion.Item>
      ))} */}
    </Accordion>
  );
};

export default Chat;

