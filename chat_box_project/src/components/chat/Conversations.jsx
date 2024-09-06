import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ConversationItem from './ConversationItem';
import useAuth from '../hooks/useAuth';

// Define userService to fetch user info
const Conversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [conversations, setConversations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteConversationId, setInviteConversationId] = useState(null);
  const [newUserId, setNewUserId] = useState('');
  const { auth, setUserDetails } = useAuth();

  // Function to get the current user's ID and details
  const fetchUserAndConversations = async () => {
    try {
      const [usersRes, conversationsRes] = await Promise.all([
        axiosPrivate.get('/users'),
        axiosPrivate.get('/conversations'),
      ]);

      const userList = usersRes.data;
      const currentUser = userList.find(user => user.username === auth.username);

      if (currentUser) {
        setUserDetails({
          userID: currentUser.userId,
          avatar: currentUser.avatar,
          userList,
        });
      }

      const uniqueConversations = [...new Set([...conversationsRes.data])];
      setConversations(uniqueConversations);
    } catch (err) {
      console.error('Error fetching users or conversations', err);
    }
  };

  useEffect(() => {
    if (auth.username) {
      fetchUserAndConversations();
    }
  }, [auth.username, axiosPrivate, setUserDetails]);

  const handleInviteClick = (conversationId) => {
    setInviteConversationId(conversationId);
    setShowInviteModal(true);
  };

  const handleInviteUser = async () => {
    try {
      await axiosPrivate.post(`/invite/${newUserId}`, { conversationId: inviteConversationId });
      setShowInviteModal(false);
    } catch (err) {
      console.error('Error inviting user', err);
    }
  };

  return (
    <>
      <Accordion>
        {/* Empty conversation item to start new conversations */}
        <Accordion.Item eventKey="new-conversation">
          <Accordion.Header>
            <div style={{ display: 'flex', alignItems: 'center' }}>              
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
                onClick={() => handleInviteClick(null)} // Open invite for a new conversation
              >
                +
              </div>
              <span> Start a new conversation</span>
            </div>
          </Accordion.Header>
        </Accordion.Item>

        {/* Existing conversations */}
        {conversations.map((conversationId) => (
          <ConversationItem
            key={conversationId}
            conversationId={conversationId}
            onInviteClick={handleInviteClick} // Pass the invite handler to child
          />
        ))}
      </Accordion>

      {/* Modal for inviting a user */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Enter user ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInviteUser}>
            Invite
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Conversations;
