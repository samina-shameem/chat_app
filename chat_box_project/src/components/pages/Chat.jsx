import React, { useEffect, useState } from 'react';
import { Accordion, Badge, Button, Form, Image } from 'react-bootstrap';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import Conversations from '../chat/Conversations';

const Chat = () => {  
  return (
    <Conversations />         
  );
};

export default Chat;
