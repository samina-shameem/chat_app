import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ConversationItem from './ConversationItem';
import useAuth from '../hooks/useAuth';

const Conversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [conversations, setConversations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteConversationId, setInviteConversationId] = useState(null);
  const [newUserId, setNewUserId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const { auth } = useAuth();

  // Function to get the current user's ID
  const setUserIDs = async () => {
    try {
      const userRes = await axiosPrivate.get('/users');
      const currentUser = userRes.data.find(user => user.username === auth.username);
      console.log(currentUser);
      if (currentUser) {
        setCurrentUserId(currentUser.userID);
      } else {
        console.error("User not found");
      }
    } catch (err) {
      console.error('Error fetching user data', err);
    }
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        //await setUserIDs();

        // Fetch conversations directly related to the user
        console.log('fetching conversations');
        const conversationsRes = await axiosPrivate.get('/conversations');
        console.log(conversationsRes.data);
        const userConversations = conversationsRes.data;
        console.log('got conversations');
        /*
        // Fetch invitations for the current user
        const userResponse = await axiosPrivate.get(`/users/${currentUserId}`);
        console.log(userResponse.data);
        const invitedConversations = userResponse.data.invite.map(invite => invite.conversationId);

        // Fetch conversations where the current user posted messages
        const messagesResponse = await axiosPrivate.get('/messages');
        const conversationsPostedByUserSelf = [...new Set(messagesResponse.data.map(msg => msg.conversationId))];
        */

        // Merge all conversations and remove duplicates
        //const uniqueConversations = [...new Set([...userConversations, ...invitedConversations, ...conversationsPostedByUserSelf])];
        const uniqueConversations = [...new Set([...userConversations])];
        setConversations(uniqueConversations);

      } catch (err) {
        console.error('Error fetching conversations', err);
      }
    };

    fetchConversations();
  }, [currentUserId, axiosPrivate]);

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
