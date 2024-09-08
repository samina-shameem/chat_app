import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
  Button
} from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Avatar from "../profile/Avatar"; 


const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosPrivate.get("/users/" + auth.userID);
        setProfileData(response.data[0]);
        setUpdatedData({
          username: response.data[0].username,
          password: auth.password,
          email: response.data[0].email,
          avatar: response.data[0].avatar,
        });
      } catch (error) {
        setError("Failed to load profile data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.userID) {
      fetchProfileData();
    }
  }, [auth]);

    const handleAccountDeletion = async () => {
      setDeactivating(true);
      setError(null);

      try {
        const response = await axiosPrivate.delete(`/users/${auth.userID}`);

        if (response.status === 200) {
          const { message } = response.data;
          await logout();
          navigate("/login", { state: { message } });
        } else {
          setError(response.data);
        }
      } catch (error) {
        setError("Failed to delete account");
      } finally {
        setDeactivating(false);
      }
    };

    const handleEditClick = async (event) => {
      event.preventDefault();
      setIsEditing(true);
    };

    const handleCancelClick = () => {
      setIsEditing(false);
    };

    const handleSaveClick = async (event) => {
      event.preventDefault();
      try {
        const response = await axiosPrivate.put("/user", {
          userId: auth.userID,
          updatedData: updatedData,
        });
        if (response.status === 200) {
          const { message } = response.data;
          await logout();
          navigate("/login", { state: { message } });
        } else {
          setError(response.data);
        }
        setIsEditing(false);
      } catch (error) {
        setError("Failed to update profile data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
  
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

 

  if (!profileData) {
    return (
      <Container className="mt-5">
        <Alert variant="info">No profile data available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center">
                  {profileData.avatar ? (
                    <Image
                      src={profileData.avatar}
                      alt={profileData.username}
                      roundedCircle
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Avatar name={profileData.username} size={100} />
                  )}
                </Col>
                <Col md={4}>
                  <h2>{profileData.username}</h2>
                  <p>Email: {profileData.email}</p>
                </Col>
                <Col>
                  {!isEditing ? (
                    <Row className="m-4">
                    <Button variant="secondary" onClick={handleEditClick}>Edit</Button>
                    </Row>
                  ) : (
                    <Row className="m-4">
                      <Form onSubmit={handleSaveClick}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={updatedData.username}
                            onChange={(event) =>
                              setUpdatedData({
                                ...updatedData,
                                username: event.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={updatedData.password}
                            onChange={(event) =>
                              setUpdatedData({
                                ...updatedData,
                                password: event.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={updatedData.email}
                            onChange={(event) =>
                              setUpdatedData({
                                ...updatedData,
                                email: event.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                          Save
                        </Button>
                        <Button
                          className="ms-2"
                          variant="secondary"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </Button>
                      </Form>
                    </Row>
                  )}
                  <Row className="m-4">
                    <Button
                      variant="secondary"
                      onClick={handleAccountDeletion}
                      disabled={deactivating}
                    >
                      {deactivating ? "Deactivating the account ..." : "Deactivate account"}
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <h4>Invites:</h4>
              {profileData.invite ? (
                <ul>
                  {JSON.parse(profileData.invite).map((invite) => (
                    <li key={invite.conversationId}>{invite.username}</li>
                  ))}
                </ul>
              ) : (
                <p>No invites available</p>
              )}
            </Card.Body>
          </Card>
          
          {error && (
            <Container className="mt-5">
              <Alert variant="danger">{error}</Alert>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

