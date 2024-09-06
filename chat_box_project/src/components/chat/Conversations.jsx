import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConversationItem from "./ConversationItem";
import useAuth from "../hooks/useAuth";

// Define userService to fetch user info
const Conversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [conversations, setConversations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteConversationId, setInviteConversationId] = useState(null);
  const [newUserId, setNewUserId] = useState("");
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
      const userList = usersRes.data;
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

      // Fetch invited conversations
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

      // Combine and deduplicate conversations
      const allConversations = new Set([
        ...conversationsByThisUser,
        ...invitedConversationsIds,
      ]);
      const uniqueConversations = Array.from(allConversations).map(
        (conversationId) => {
          let status = "invited"; // Default to invited
          if (
            conversationsByThisUser.includes(conversationId) &&
            invitedConversationsIds.includes(conversationId)
          ) {
            status = "invited-then-added";
          } else if (conversationsByThisUser.includes(conversationId)) {
            status = "started";
          }
          return { id: conversationId, status };
        }
      );

      setConversations(uniqueConversations);
    } catch (err) {
      console.error("Error fetching users or conversations", err);
    }
  };

  useEffect(() => {
    if (auth.username) {
      fetchUserAndConversations();
    }
  }, [auth.username, axiosPrivate]);

  const handleInviteClick = (conversationId) => {
    setInviteConversationId(conversationId);
    setShowInviteModal(true);
  };

  const handleInviteUser = async () => {
    try {
      if (!newUserId || !inviteConversationId) {
        console.error("Missing required fields");
        return;
      }

      await axiosPrivate.post(`/invite/${newUserId}`, {
        conversationId: inviteConversationId,
      });
      setShowInviteModal(false);
    } catch (err) {
      console.error("Error inviting user", err);
    }
  };

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="new-conversation">
          <Accordion.Header>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  textAlign: "center",
                  lineHeight: "30px",
                  marginLeft: "auto",
                }}
                onClick={() => handleInviteClick(null)}
              >
                +
              </div>
              <span> Start a new conversation</span>
            </div>
          </Accordion.Header>
        </Accordion.Item>

        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversationId={conversation.id}
            status={conversation.status}
            onInviteClick={handleInviteClick}
          />
        ))}
      </Accordion>

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
