import React from 'react';
import { Form, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await loginService(username, password);
            alert('Login successful');
        } catch {
            alert('Login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        style={{ width: '300px' }}
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        style={{ width: '300px' }}
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </Form.Group>

                <Button
                    style={{ width: '300px' }}
                    variant="primary"
                    type="submit"
                >
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
