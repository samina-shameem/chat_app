import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../profile/Avatar";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { auth } = useAuth();
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Navbar.Brand as={Link} to="/" className="p-4">
        Chat Box
      </Navbar.Brand>
      <Container className="justify-content-end">
        <Nav className="mr-auto ">
          {auth?.username ? (
            <>
              <Nav.Link as={Link} to="/profile" className="p-4 mr-3"> {auth?.username}</Nav.Link>
              <Avatar
                className="p-4 mr-3"
                src={auth.avatar}
                alt={auth.username}
              />
            </>
          ) : (
            <>
            <Nav.Link as={Link} to="/" className="p-4 mr-3"> Home </Nav.Link>
            <Nav.Link as={Link} to="/login" className="p-4 mr-3"> Log in</Nav.Link>
            <Nav.Link as={Link} to="/register" className="p-4 mr-3"> Register</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
