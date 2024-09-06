import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
      
      const accessToken  = response.token;
      console.info(accessToken);

      // Set auth with username, password, and token
      login({ username, password, accessToken });
      setUsername('');
      setPassword('');
      setLoading(false);
      console.info('Going to :',{from});
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      {location.state?.message && <Alert variant="success" className="mb-4">{location.state.message}</Alert>}
      <Form className="border p-4 mb-4" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            className="w-100"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            className="w-100"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <Button
          className="w-100"
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

