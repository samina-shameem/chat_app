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
              <Nav.Link className="p-4 mr-3"> {auth?.username}</Nav.Link>
              <Avatar
                className="p-4 mr-3"
                src={auth.avatar}
                alt={auth.username}
              />
            </>
          ) : (
            <></>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
