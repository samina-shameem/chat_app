import React from "react";
import { Form, Button } from "react-bootstrap";

import { Link } from "react-router-dom";
import { loginService } from "../../services/apiService";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginData = { username, password };
      const response = await loginService(loginData);

      if (!response) {
        setError("No response from server");
        setLoading(false);
        return;
      }

      if (!response.data) {
        setError("No data in response");
        setLoading(false);
        return;
      }

      const { token } = response.data;

      if (!token) {
        setError("No token in response");
        setLoading(false);
        return;
      }

      // Set auth with username, password, and token
      login({ username, password, token });

      setLoading(false);

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      // Handle different error responses
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Login failed. Please try again.");
      }
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

        <Button style={{ width: "300px" }} variant="primary" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
        <p className="mt-2">
          Not registered yet ? <Link to="/register">Register</Link>
        </p>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Form>
    </div>
  );
};

export default LoginPage;
