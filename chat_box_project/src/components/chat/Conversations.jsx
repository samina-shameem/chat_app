import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConversationItem from "./ConversationItem";
import useAuth from "../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import InviteUsers from "./InviteUsers";
import { Container, Row, Col } from "react-bootstrap";

const Conversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [conversations, setConversations] = useState([{}]);
  const [clickedConversationID, setClickedConversationID] = useState();
  const { auth, setUserDetails } = useAuth();

  const fetchUserAndConversations = async () => {
    try {
      if (!auth.username) {
        return;
      }

      const [usersRes, conversationsRes] = await Promise.all([
        axiosPrivate.get("/users"),
        axiosPrivate.get("/conversations"),
      ]);
      const conversationsByThisUser = conversationsRes.data;
      const userList = usersRes.data.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      const currentUser = userList.find(
        (user) => user.username === auth.username
      );

      if (!currentUser) {
        console.error("User not found");
        return;
      }

      setUserDetails({
        userID: currentUser.userId,
        avatar: currentUser.avatar,
        userList,
      });

      const userDetailsRes = await axiosPrivate.get(
        "/users/" + currentUser.userId
      );
      const invitedConversationsData = userDetailsRes.data[0]?.invite;
      const invitedConversationsArray = invitedConversationsData
        ? JSON.parse(invitedConversationsData)
        : [];
      const invitedConversationsIds = invitedConversationsArray.map(
        (invite) => invite.conversationId
      );

      const allMessagesRes = await axiosPrivate.get("/messages");
      const allMessagesConversationIds = allMessagesRes.data.map(
        (message) => message.conversationId
      );

      const allConversations = new Set([
        ...allMessagesConversationIds,
        ...conversationsByThisUser,
        ...invitedConversationsIds,
      ]);
      const uniqueConversations = Array.from(allConversations).map(
        (conversationId) => {
          let status = "self";
          if (
            conversationsByThisUser.includes(conversationId) &&
            invitedConversationsIds.includes(conversationId)
          ) {
            status = "invited-then-added";
          } else if (conversationsByThisUser.includes(conversationId)) {
            status = "started";
          } else if (invitedConversationsIds.includes(conversationId)) {
            status = "invited";
          }
          return { id: conversationId, status };
        }
      );

      setConversations([
        /* { id: "", status: "new-conversation" }, */
        ...uniqueConversations,
      ]);
    } catch (err) {
      console.error("Error fetching users or conversations", err);
    }
  };

  useEffect(() => {
    if (auth.username) {
      fetchUserAndConversations();
    }
  }, [auth.username]);

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center border m-3">
          <Col>
            <p className="m-3">Invite a new conversation</p>
          </Col>
          <Col>
            <InviteUsers conversationId={uuidv4} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion>
              {conversations.map((conversation) => (
                <ConversationItem
                  key={
                    conversation.id
                      ? conversation.id
                      : `new-conversation-${uuidv4()}`
                  }
                  conversationId={conversation.id}
                  status={
                    conversation.status
                      ? conversation.status
                      : "new-conversation"
                  }
                  refreshRate={0}
                />
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Conversations;
