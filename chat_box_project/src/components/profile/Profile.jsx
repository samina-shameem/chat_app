import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Image } from "react-bootstrap";
import Avatar from "../profile/Avatar"; // Assuming you have an Avatar component
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosPrivate.get("/users/"+auth.userID);
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
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
        <Col md={8}>
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
                <Col md={8}>
                  <h2>{profileData.username}</h2>
                  <p>Email: {profileData.email}</p>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

