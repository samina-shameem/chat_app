import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Avatar from "../profile/Avatar";
import { Container, Row, Col } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

const InviteUsers = ({ conversationId }) => {
  const { auth } = useAuth();
  const [show, setShow] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [unSelectedUserIds, setUnSelectedUserIds] = useState(
    auth.userList
      ? auth.userList
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user) => user.userId)
      : []
  );

  const handleClose = () => {
    console.log("Closing invite users modal",conversationId);
    setShow(false);
  };
  const handleShow = () => {
    console.log("Showing invite users modal");
    console.log("conversationId:",conversationId);
    console.log("selectedUserIds:",selectedUserIds);
    console.log("unSelectedUserIds:",unSelectedUserIds);
    selectedUserIds
    setShow(true);
  };

  const handleShowLog = () => {
    console.log("conversationId:",conversationId);
    console.log("selectedUserIds:",selectedUserIds);
    console.log("unSelectedUserIds:",unSelectedUserIds);  
  };

  const handleInvite = async () => {
    try {
      for (const userId of selectedUserIds) {
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
    setSelectedUserIds((prevSelectedUserIds) =>
      prevSelectedUserIds
        .filter((id) => id !== userId)
        .sort((a, b) => {
          const userA = auth.userList.find((user) => user.userId === a);
          const userB = auth.userList.find((user) => user.userId === b);
          return userA.username.localeCompare(userB.username);
        })
    );
    setUnSelectedUserIds((prevUnSelectedUserIds) => [
      ...prevUnSelectedUserIds,
      userId,
    ].sort((a, b) => {
      const userA = auth.userList.find((user) => user.userId === a);
      const userB = auth.userList.find((user) => user.userId === b);
      return userA.username.localeCompare(userB.username);
    }));
    console.log("handleUnSelectUser");
    console.log("conversationId:",conversationId);
    console.log("selectedUserIds:",selectedUserIds);
    console.log("unSelectedUserIds:",unSelectedUserIds);

  };

  const handleSelectUser = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      const newSelectedUserIds = [...prevSelectedUserIds, userId];
      return newSelectedUserIds.sort((a, b) => {
        const userA = auth.userList.find((user) => user.userId === a);
        const userB = auth.userList.find((user) => user.userId === b);
        return userA.username.localeCompare(userB.username);
      });
    });
    setUnSelectedUserIds((prevUnSelectedUserIds) => {
      const newUnSelectedUserIds = prevUnSelectedUserIds.filter((id) => id !== userId);
      return newUnSelectedUserIds.sort((a, b) => {
        const userA = auth.userList.find((user) => user.userId === a);
        const userB = auth.userList.find((user) => user.userId === b);
        return userA.username.localeCompare(userB.username);
      });
    });
    console.log("handleSelectUser");
    console.log("conversationId:",conversationId);
    console.log("selectedUserIds:",selectedUserIds);
    console.log("unSelectedUserIds:",unSelectedUserIds);
  };

  const getRowsSelected = ({ index, style }) => {
    const user = auth.userList.find(
      (u) => u.userId === selectedUserIds[index]
    );
    if (!user) return null;
    return (
      <Container style={style} key={user.userId} className="d-flex align-items-center">
        {user.avatar ? (
          <Avatar src={user.avatar} alt="" />
        ) : (
          <Avatar src={user.username} alt="" />
        )}
        <Form.Label>{user.username}</Form.Label>
        <Button variant="link" onClick={() => handleUnSelectUser(user.userId)}>
          Remove
        </Button>
      </Container>
    );
  };

  const getRowsUnSelected = ({ index, style }) => {
    const user = auth.userList.find(
      (u) => u.userId === unSelectedUserIds[index]
    );
    if (!user) return null;
    return (
      <Container style={style} key={user.userId} className="d-flex align-items-center">
        {user.avatar ? (
          <Avatar src={user.avatar} alt="" />
        ) : (
          <Avatar src={user.username} alt="" />
        )}
        <Form.Label>{user.username}</Form.Label>
        <Button variant="primary" onClick={() => handleSelectUser(user.userId)}>
          Add
        </Button>
      </Container>
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="m-2">
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
            itemCount={selectedUserIds.length}
            itemSize={50}
            width="100%"
          >
            {getRowsSelected}
          </List>
          {/* Unselected Users from which we can select */}
          <List
            height={400}
            itemCount={unSelectedUserIds.length}
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
          <Button variant="primary" onClick={handleShowLog}>
            show log
          </Button>

          
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InviteUsers;
