import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

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

  const getHeaderStyle = () => {
    if (!status) {
      console.error("status is null");
      return {};
    }

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
    if (!userId) {
      console.error("userId is null");
      return null;
    }

    return (
      <div
        key={userId}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          textAlign: "center",
          lineHeight: "30px",
          margin: "0 10px",
        }}
      >
        {userId}
      </div>
    );
  };

  return (
    <Accordion.Item eventKey={conversationId}>
      <Accordion.Header
        onClick={() => setIsActive(!isActive)}
        style={getHeaderStyle()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          {/* For "started" conversations, align to the left */}
          {status === "started" && (
            <>
              <span>{status}</span>
              {Array.from(participants).map((userId) => renderAvatar(userId))}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  textAlign: "center",
                  lineHeight: "30px",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent Accordion toggle
                  onInviteClick(conversationId);
                }}
              >
                +
              </div>
            </>
          )}

          {/* For other statuses, align to the right */}
          {status !== "started" && (
            <>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  textAlign: "center",
                  lineHeight: "30px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInviteClick(conversationId);
                }}
              >
                +
              </div>
              {Array.from(participants).map((userId) => renderAvatar(userId))}
              <span>{status}</span>
            </>
          )}
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
            style={{ width: "90%" }}
          />
          <Button
            variant="primary"
            style={{ width: "10%" }}
            onClick={handleSendMessage}
          >
            Send
          </Button>
          {REFRESH_RATE === 0 && (
            <Button
              variant="secondary"
              style={{ width: "10%" }}
              onClick={handleRefreshClick}
            >
              Refresh
            </Button>
          )}
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ConversationItem;
