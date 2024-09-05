import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// Define loginService outside of handleSubmit
const loginService = async (loginData, axiosPrivate) => {
  try {
    const response = await axiosPrivate.post('/auth/token', loginData);
    console.info('Logged in successfully');
    return response.data;
  } catch (error) {
    console.error('Error generating auth token:', error);
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
  const axiosPrivate = useAxiosPrivate(); // Get axios instance

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

      const { token } = response;

      // Set auth with username, password, and token
      login({ username, password, token });

      setLoading(false);
      console.info('Going to dashboard...');
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            style={{ width: "300px" }}
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            style={{ width: "300px" }}
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <Button
          style={{ width: "300px" }}
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
        <p className="mt-2">
          Not registered yet? <Link to="/register">Register</Link>
        </p>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Form>
    </div>
  );
};

export default LoginPage;
