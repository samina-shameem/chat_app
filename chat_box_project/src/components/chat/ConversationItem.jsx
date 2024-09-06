import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const ConversationItem = ({ conversationId, onInviteClick }) => {
  const axiosPrivate = useAxiosPrivate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState({});
  const [isActive, setIsActive] = useState(false);

  // Fetch messages for this conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosPrivate.get(`/messages?conversationId=${conversationId}`);
        setMessages(response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      } catch (err) {
        console.error(`Error fetching messages for conversation ${conversationId}`, err);
      }
    };

    if (isActive) {
      const intervalId = setInterval(fetchMessages, 10000); // Active conversation, fetch every 10s
      return () => clearInterval(intervalId);
    } else {
      fetchMessages(); // Inactive, fetch only once
    }
  }, [conversationId, isActive, axiosPrivate]);

  // Fetch user info for this conversation
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${conversationId}`);
        setUser(response.data);
      } catch (err) {
        console.error(`Error fetching user for conversation ${conversationId}`, err);
      }
    };

    fetchUser();
  }, [conversationId, axiosPrivate]);

  const handleSendMessage = async () => {
    try {
      await axiosPrivate.post('/messages', {
        text: newMessage,
        conversationId,
      });
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <Accordion.Item eventKey={conversationId}>
      <Accordion.Header onClick={() => setIsActive(!isActive)}>
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
        ) : (
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              textAlign: 'center',
              lineHeight: '30px',
            }}
          >
            {user.username ? user.username[0].toUpperCase() : 'U'}
          </div>
        )}
        {messages.length > 0 && ` ${messages[0].text.substring(0, 20)}...`}
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            textAlign: 'center',
            lineHeight: '30px',
            marginLeft: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent Accordion toggle
            onInviteClick(conversationId);
          }}
        >
          +
        </div>
      </Accordion.Header>

      <Accordion.Body>
        {messages.map((message) => (
          <Badge key={message.id} bg={message.userId === user.id ? 'primary' : 'secondary'} className="mb-2" style={{ display: 'block' }}>
            {message.text}
          </Badge>
        ))}

        <Form className="mt-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ width: '90%' }}
          />
          <Button variant="primary" style={{ width: '10%' }} onClick={handleSendMessage}>
            Send
          </Button>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ConversationItem;
