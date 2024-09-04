import React from "react";
import { Form, Button } from "react-bootstrap";

import { Link } from "react-router-dom";
import { generateAuthToken } from "../../services/apiService";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginData = { username, password };
      const response = await generateAuthToken(loginData);

      // Assuming the API response contains a token
      const { token } = response;

      // Set auth with username, password, and token
      setAuth({ username, password, token });

      setLoading(false);

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (err) {
      // Handle different error responses
      if (err.response) {
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

        <Button style={{ width: "300px" }} variant="primary" type="submit">
          Login
        </Button>
        <p className="mt-2">
          Not registered yet ? <Link to="/register">Register</Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
