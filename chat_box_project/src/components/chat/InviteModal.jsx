import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Avatar from '../profile/Avatar';

const InviteModal = ({ conversationId }) => {
  const axiosPrivate = useAxiosPrivate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { auth } = useAuth();

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleInvite = async () => {
    try {
      await Promise.all(selectedUsers.map(userId =>
        axiosPrivate.post(`/invite/${userId}`, { conversationId })
      ));
      alert('Users invited successfully');
      onHide(); // Close the modal after inviting
    } catch (err) {
      console.error("Error inviting users", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {auth.userList.map(user => (
          <Form.Check
            key={user.userId}
            type="checkbox"
            id={`user-${user.userId}`}
            label={
              <Container className="d-flex align-items-center">
                user.avatar ? (
      <Avatar src={user.avatar} alt="" />
    ) : (
      <Avatar src={user.username} alt="" />
    );
                {user.username}
              </Container>
            }
            checked={selectedUsers.includes(user.userId)}
            onChange={() => handleUserSelect(user.userId)}
          />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleInvite}>
          Invite
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
