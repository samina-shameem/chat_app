import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Card,
  Col,
  Container,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosPrivate.get("/users/" + auth.userID);
        setProfileData(response.data[0]);
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

      const handleEditClick = async () => {
        try {
          const response = await axiosPrivate.put("/users/" + auth.userID);
          setProfileData(response.data[0]);
        } catch (error) {
          setError("Failed to load profile data");
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
                  <Row className="m-4">
                    <Button variant="secondary" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </Row>
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
