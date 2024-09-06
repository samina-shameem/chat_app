import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConversationItem from "./ConversationItem";
import useAuth from "../hooks/useAuth";

// Define userService to fetch user info
const Conversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const [conversations, setConversations] = useState([]);
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

      // Add empty message for new conversation
      setConversations([{ id: null, status: "new conversation" }, ...uniqueConversations]);
    } catch (err) {
      console.error("Error fetching users or conversations", err);
    }
  };

  useEffect(() => {
    if (auth.username) {
      fetchUserAndConversations();
    }
  }, [auth.username, axiosPrivate]);

  return (
    <>
      <Accordion>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversationId={conversation.id}
            status={conversation.status}
          />
        ))}
      </Accordion>
    </>
  );
};

export default Conversations;

