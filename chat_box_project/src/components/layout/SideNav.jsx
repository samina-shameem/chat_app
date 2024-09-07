import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { FaUser, FaComments, FaSignOutAlt, FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
// import './sideNav.css'; // Uncomment if you have custom styles

function SideNav() {
  const { auth, logout } = useAuth() || {};
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      if (logout) {
        await logout(); // Call the logout function
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Nav variant="tabs" defaultActiveKey="/home" className="mb-2">
        <Nav.Item>
          <Nav.Link onClick={handleShow}>
            <FaBars />
          </Nav.Link>
        </Nav.Item>
        {auth?.username && (
          <>
            <Nav.Item>
              <Nav.Link as={Link} to="/profile">
                <FaUser />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/chat">
                <FaComments />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={handleLogout}>
                <FaSignOutAlt />
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {auth?.username && (
              <>
                <Nav.Link as={Link} to="/profile">
                  <FaUser /> Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/chat">
                  <FaComments /> Chat Room
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <FaSignOutAlt /> Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideNav;
