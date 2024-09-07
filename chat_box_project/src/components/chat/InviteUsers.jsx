import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Avatar from "../profile/Avatar";
import { Container } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const InviteUsers = ({ conversationId }) => {
  const { auth } = useAuth();
  const [show, setShow] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [unSelectedUsers, setUnSelectedUsers] = useState(auth.userList || []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      handleClose();
    } catch (err) {
      console.error("Error inviting users", err);
    }
  };

  const handleUnSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((id) => id !== userId)
    );
    setUnSelectedUsers((prevUnSelectedUsers) => [
      ...prevUnSelectedUsers,
      userId,
    ]);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      userId,
    ]);
    setUnSelectedUsers((prevUnSelectedUsers) =>
      prevUnSelectedUsers.filter((id) => id !== userId)
    );
  };

  const getRowsSelected = ({ index, style }) => {
    const user = auth.userList.find((u) => u.userId === selectedUsers[index]);
    if (!user) return null;
    return (
      <Container style={style} key={user.userId} className="d-flex align-items-center">
        {user.avatar ? (
          <Avatar src={user.avatar} alt="" />
        ) : (
          <Avatar src={user.username} alt="" />
        )}
        {user.username}
        <Button onClick={() => handleUnSelectUser(user.userId)}> - </Button>
      </Container>
    );
  };

  const getRowsUnSelected = ({ index, style }) => {
    const user = auth.userList.find((u) => u.userId === unSelectedUsers[index]);
    if (!user) return null;
    return (
      <Container style={style} key={user.userId} className="d-flex align-items-center">
        {user.avatar ? (
          <Avatar src={user.avatar} alt="" />
        ) : (
          <Avatar src={user.username} alt="" />
        )}
        {user.username}
        <Button onClick={() => handleSelectUser(user.userId)}> + </Button>
      </Container>
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        +
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Selected Users from which we can unselect */}
          <List
            height={400}
            itemCount={selectedUsers.length}
            itemSize={50}
            width="100%"
          >
            {getRowsSelected}
          </List>
          {/* Unselected Users from which we can select */}
          <List
            height={400}
            itemCount={unSelectedUsers.length}
            itemSize={50}
            width="100%"
          >
            {getRowsUnSelected}
          </List>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleInvite}>
            Invite
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InviteUsers;
