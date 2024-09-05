import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerData = {
        username,
        password,
        email,
        avatar: ""
      };

      if (!registerData.username || !registerData.password || !registerData.email) {
        setError("Username, password, and email are required");
        setLoading(false);
        return;
      }

      console.info("Sending registration request...");
      const response = await axiosPrivate.post('/auth/register', registerData);

      if (response.status === 201) {
        const { message } = response.data;
        setLoading(false);
        console.info(`Registration successful: ${message}`);
        navigate("/login", { state: { message } });
      } else if (response.status === 400) {
        console.error("Bad request");
        setError("Bad request");
        setLoading(false);
      } else if (response.status === 500) {
        console.error("Internal error");
        setError("Internal error");
        setLoading(false);
      } else {
        console.error("Registration failed. Please try again.");
        setError("Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          <Form.Label>Email:</Form.Label>
          <Form.Control
            style={{ width: "300px" }}
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
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
          {loading ? "Loading..." : "Register"}
        </Button>
        <p className="mt-2">
          Already registered? <Link to="/login">Login</Link>
        </p>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Form>
    </div>
  );
};

export default RegisterPage;

