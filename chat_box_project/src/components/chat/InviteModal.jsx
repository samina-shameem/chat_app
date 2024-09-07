import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Avatar from "../profile/Avatar";
import { Container } from "react-bootstrap";

const InviteModal = ({ conversationId, show, onHide }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      }
      return [...prevSelectedUsers, userId];
    });
  };

  const handleInvite = async () => {
    try {
      for (const userId of selectedUsers) {
        await axiosPrivate.post(`/invite/${userId}`, {
          conversationId,
        });
      }
      onHide();
    } catch (err) {
      console.error("Error inviting users", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Invite Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {auth.userList
          ?.sort((a, b) => a.username.localeCompare(b.username))
          .map((user) => (
          <Form.Check
            key={user.userId}
            type="checkbox"
            id={`user-${user.userId}`}
            label={
              <Container className="d-flex align-items-center">
                {user.avatar ? (
                  <Avatar src={user.avatar} alt="" />
                ) : (
                  <Avatar src={user.username} alt="" />
                )}
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
