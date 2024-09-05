import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const registrationData = {
        username,
        password,
        email,
      };

      if (!registrationData.username || !registrationData.password || !registrationData.email) {
        setError("Username, password, and email are required");
        setIsLoading(false);
        return;
      }

      const response = await axiosPrivate.post('/auth/register', registrationData);

      if (response.status === 201) {
        const { message } = response.data;
        setIsLoading(false);
        navigate("/login", { state: { message } });
      } else {
        setError("Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unknown error");
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      {location.state?.message && <Alert variant="success" className="mb-4">{location.state.message}</Alert>}
      <Form onSubmit={handleSubmit} className="border p-4 mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="mb-3"
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
        <p className="text-center">
          Already registered? <Link to="/login">Login</Link>
        </p>
        {error && <div className="text-danger">{error}</div>}
      </Form>
    </div>
  );
};

export default RegisterPage;

