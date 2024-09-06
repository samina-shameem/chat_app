import React from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const loginService = async (loginData, axiosPrivate) => {
  try {
    const response = await axiosPrivate.post("/auth/token", loginData);
    console.info("Logged in successfully");
    return response.data;
  } catch (error) {
    console.error("Error generating auth token:", error);
    throw error;
  }
};

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const from = location.state?.from?.pathname || "/chat";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginData = { username, password };

      if (!loginData.username || !loginData.password) {
        setError("Username and password are required");
        setLoading(false);
        return;
      }

      const response = await loginService(loginData, axiosPrivate);

      if (!response || !response.token) {
        setError("No token in response");
        setLoading(false);
        return;
      }

      const accessToken = response.token;
      console.info(accessToken);

      login({ username, password, accessToken });
      setUsername("");
      setPassword("");
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center ">
        <Col md={6} lg={4}> {/* Fixed width for all components */}
          {location.state?.message && (
            <Alert variant="success" className="mb-4">
              {location.state.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="border p-3">
            <Form.Group>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="mt-3  w-100">
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form>

          <p className="p-4">
            Not registered yet? <Link to="/register"> Register </Link>
          </p>

          {error && <Alert variant="danger" className="m-3">{error}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
