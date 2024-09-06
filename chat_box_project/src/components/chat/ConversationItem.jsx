import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Avatar from "../profile/Avatar";

const REFRESH_RATE = 0; // Set to 0 for manual refresh
const ConversationItem = ({ conversationId, status, onInviteClick }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState(new Set());
  const [isActive, setIsActive] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!axiosPrivate) {
        console.error("axiosPrivate is null");
        return;
      }

      try {
        const response = await axiosPrivate.get(
          `/messages?conversationId=${conversationId}`
        );
        if (!response || !response.data) {
          console.error("No response or data from message fetch");
          return;
        }

        const sortedMessages = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        if (!sortedMessages) {
          console.error("sortedMessages is null");
          return;
        }

        const uniqueParticipants = new Set(
          sortedMessages.map((message) => message.userId)
        );
        setParticipants(uniqueParticipants);
        setMessages(sortedMessages);
      } catch (err) {
        console.error(
          `Error fetching messages for conversation ${conversationId}`,
          err
        );
      }
    };

    fetchMessages();
  }, [conversationId, axiosPrivate, refresh]);

  const handleSendMessage = async () => {
    if (!axiosPrivate) {
      console.error("axiosPrivate is null");
      return;
    }

    try {
      await axiosPrivate.post("/messages", {
        text: newMessage,
        conversationId,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleRefreshClick = () => {
    setRefresh((refresh) => !refresh);
  };

  const getContainerStyle = () => {
    switch (status) {
      case "started":
        return { backgroundColor: "#d4edda", justifyContent: "flex-start" }; // Green for "started"
      case "invited":
        return { backgroundColor: "#fff3cd", justifyContent: "flex-end" }; // Yellow for "invited"
      case "invited-then-added":
        return { backgroundColor: "#cce5ff", justifyContent: "flex-end" }; // Blue for "invited-then-added"
      default:
        return {};
    }
  };

  const renderAvatar = (userId) => {
    if (userId === null || userId === undefined) {
      console.error("userId is null or undefined");
      return null;
    }

    const user = auth.userList?.find((user) => user.userId === userId);
    if (!user) {
      console.error(`User with id ${userId} not found`);
      return null;
    }

    if (!user.username) {
      console.error("User without username");
      return null;
    }

    return user.avatar ? (
      <Avatar key={userId} src={user.avatar} alt="" />
    ) : (
      <Avatar key={userId} src={user.username} alt="" />
    );
  };

  return (
    <Accordion.Item eventKey={conversationId}>
      <Accordion.Header
        onClick={() => setIsActive(!isActive)}
        style={getContainerStyle()}
      >
        <div
          className="d-flex"
          style={{
            justifyContent: "flex-start",
            gap: "10px",
            width: "100%",
          }}
        >
          <span>{status}</span>
          {Array.from(participants).map((userId) => renderAvatar(userId))}
          <Dropdown
            style={{ width: "30px", height: "30px" }}
            onClick={(e) => {
              e.stopPropagation();
              onInviteClick(conversationId);
            }}
          >
            <Dropdown.Toggle
              variant="secondary"
              style={{ width: "30px", height: "30px" }}
            >
              +
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  onInviteClick(conversationId);
                }}
              >
                Invite
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Accordion.Header>

      <Accordion.Body>
        {messages.map((message) => {
          const isCurrentUser = message.userId === (auth.userID ?? null);
          return (
            <div
              key={message.id}
              className="d-flex mb-2"
              style={{
                justifyContent: isCurrentUser ? "flex-start" : "flex-end",
              }}
            >
              {isCurrentUser && renderAvatar(message.userId)}

              <Badge
                bg={isCurrentUser ? "primary" : "secondary"}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                }}
              >
                {message.text}
              </Badge>
            </div>
          );
        })}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ConversationItem;

