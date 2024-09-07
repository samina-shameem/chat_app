import React, { useState } from "react";
import { Popover, OverlayTrigger, Button, Form, Container } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Avatar from "../profile/Avatar";

function InvitePopover({ conversationId }) {
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
    } catch (err) {
      console.error("Error inviting users", err);
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Invite Users</Popover.Header>
      <Popover.Body>
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
        <Button variant="primary" onClick={handleInvite}>
          Invite
        </Button>
      
      </Popover.Body>
      
      
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
      <Button variant="secondary">+</Button>
    </OverlayTrigger>
  );
};

export default InvitePopover;

