import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import Avatar from "../profile/Avatar";
import { v4 as uuidv4 } from "uuid";
import { Container, Row, Col } from "react-bootstrap";
import InviteUsers from "./InviteUsers";
import { MdDeleteForever   } from "react-icons/md";

const ConversationItem = ({ conversationId, status, refreshRate }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState(new Set());
  const [isActive, setIsActive] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const effectiveConversationId = conversationId || uuidv4();
  console.info("********************************************");
  console.log(effectiveConversationId);
  console.log(messages);
  console.log(conversationId);
  console.info("********************************************");
  const fetchMessages = async () => {
    if (!axiosPrivate) {
      console.error("axiosPrivate is null");
      return;
    }
    console.info("====================================");
    console.info(conversationId);
    console.info(status);
    console.info(effectiveConversationId);
    console.info(messages);
    console.info("====================================");
    if (!effectiveConversationId) {
      console.info("Empty conversationId", status);
      setMessages([]);
      return;
    }
    try {
      const response = await axiosPrivate.get(
        `/messages?conversationId=${effectiveConversationId}`
      );

      if (!response || !response.data) {
        console.error("No response or data from message fetch");
        setMessages([]);
        setParticipants([]);
        return;
      }

      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      const uniqueParticipants = new Set(
        sortedMessages.map((message) => message.userId)
      );
      uniqueParticipants.delete(auth.userID);
      setParticipants(uniqueParticipants);
      setMessages(sortedMessages);
    } catch (err) {
      console.error(
        `Error fetching messages for conversation ${effectiveConversationId}`,
        err
      );
      setMessages([]);
      setParticipants([]);
    }
  };

  useEffect(() => {
    fetchMessages();
    if (refreshRate > 0) {
      const refreshInterval = setInterval(fetchMessages, refreshRate * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [conversationId, refresh]);

  const handleSendMessage = async () => {
    try {
      await axiosPrivate.post("/messages", {
        text: newMessage,
        conversationId: effectiveConversationId,
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axiosPrivate.delete(`/messages/${messageId}`);
      fetchMessages(); // Refresh the message list after deleting
    } catch (err) {
      console.error("Error deleting message", err);
    }
  };

  const handleRefreshClick = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const getHeaderClassName = () => {
    switch (status) {
      case "started":
        return "bg-success text-light";
      case "invited":
        return "bg-warning text-dark";
      case "invited-then-added":
        return "bg-primary text-light";
      default:
        return "bg-success text-light";
    }
  };

  const renderAvatar = (userId) => {
    if (!userId) return null;
    const user = auth.userList?.find((user) => user.userId === userId);
    if (!user) return null;
    return user.avatar ? (
      <Avatar key={userId} src={user.avatar} alt="" />
    ) : (
      <Avatar key={userId} src={user.username} alt="" />
    );
  };

  return (
    <Accordion.Item eventKey={effectiveConversationId}>
      <Accordion.Header
        onClick={() => setIsActive(!isActive)}
        className={`d-flex align-items-center gap-2 ${getHeaderClassName()}`}
      >
        <Container fluid>
          <Row className="align-items-center">
            <Col className="d-flex align-items-center">
              <span>{status}</span>
              {Array.from(participants).map((userId) => renderAvatar(userId))}
            </Col>
          </Row>
        </Container>
      </Accordion.Header>

      <Accordion.Body>
        {messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUsersMessage = message?.userId === auth?.userID;
            return isCurrentUsersMessage ? (
              <Container
                key={message?.id}
                className="d-flex justify-content-start"
              >
                <Row>
                  <Col>{renderAvatar(message?.userId)}</Col>
                  <Col>
                    <Badge
                      style={{
                        minWidth: "75px",
                        minHeight: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      bg="primary"
                      pill
                    >
                      {message?.text || "(empty message)"}
                    </Badge>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      className="m-1 p-1"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <MdDeleteForever />
                    </Button>
                  </Col>
                </Row>
              </Container>
            ) : (
              <Container
                key={message?.id}
                className="d-flex justify-content-end"
              >
                <Row>
                  <Col>
                    <Badge
                      style={{
                        minWidth: "75px",
                        minHeight: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      bg="secondary"
                      pill
                    >
                      {message?.text || "(empty message)"}
                    </Badge>
                  </Col>
                  <Col>{renderAvatar(message?.userId)}</Col>
                </Row>
              </Container>
            );
          })
        ) : (
          <p className="mt-3">No messages to display</p>
        )}
        <Form className="mt-3 d-flex">
          <InviteUsers conversationId={effectiveConversationId} />
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="me-2 flex-grow-1"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            className="me-2"
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
          {refreshRate === 0 && (
            <Button variant="secondary" onClick={handleRefreshClick}>
              Refresh
            </Button>
          )}
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default ConversationItem;
