import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const REFRESH_RATE = 0; // Set to 0 for manual refresh

const ConversationItem = ({ conversationId, onInviteClick }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState(new Set()); // Store unique userIds
  const [isActive, setIsActive] = useState(false);

  // Fetch messages for this conversation
  useEffect(() => {
    const fetchMessages = async () => {
        console.log("conversationId:",conversationId);
      try {
        const response = await axiosPrivate.get(`/messages?conversationId=${conversationId}`);
        console.log(response.data);
        const sortedMessages = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Collect unique participants from messages
        const uniqueParticipants = new Set(sortedMessages.map((message) => message.userId));
        setParticipants(uniqueParticipants);
        setMessages(sortedMessages);
      } catch (err) {
        console.error(`Error fetching messages for conversation ${conversationId}`, err);
      }
    };

    
    fetchMessages();
    
  }, [conversationId, isActive, axiosPrivate, REFRESH_RATE]);

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

  const handleRefreshClick = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const renderAvatar = (userId) => (
    <div
      key={userId}
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        textAlign: 'center',
        lineHeight: '30px',
        margin: '0 10px',
      }}
    >
      {userId}
    </div>
  );

  return (
    <Accordion.Item eventKey={conversationId}>
      <Accordion.Header onClick={() => setIsActive(!isActive)} style={{ justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            flex: '1', // Makes sure the content is centered
          }}
        >
          {/* Invite button first */}
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              textAlign: 'center',
              lineHeight: '30px',
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent Accordion toggle
              onInviteClick(conversationId);
            }}
          >
            +
          </div>

          {/* Display avatars of all participants */}
          {Array.from(participants).map((userId) => renderAvatar(userId))}
        </div>
      </Accordion.Header>

      <Accordion.Body>
        {messages.map((message) => {
          const isCurrentUser = message.userId === auth.userID;
          return (
            <div
              key={message.id}
              className="d-flex mb-2"
              style={{ justifyContent: isCurrentUser ? 'flex-start' : 'flex-end' }}
            >
              {isCurrentUser && renderAvatar(message.userId)}

              <Badge
                bg={isCurrentUser ? 'primary' : 'secondary'}
                style={{ padding: '10px', borderRadius: '10px', maxWidth: '70%' }}
              >
                {message.text}
              </Badge>

              {!isCurrentUser && renderAvatar(message.userId)}
            </div>
          );
        })}

        {/* Input for new message */}
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
          {REFRESH_RATE === 0 && (
            <Button variant="secondary" style={{ width: '10%' }} onClick={handleRefreshClick}>
              Refresh
            </Button>
          )}
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ConversationItem;
