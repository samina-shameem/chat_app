import React from 'react';

import { Form, Button } from 'react-bootstrap';

const RegisterPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [emailConfirm, setEmailConfirm] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            alert('Password confirmation does not match');
            return;
        }
        if (email !== emailConfirm) {
            alert('Email confirmation does not match');
            return;
        }
        try {
            await registerService(username, email, password);
            alert('User registered successfully');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="text" value={username} onChange={event => setUsername(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="email" value={email} onChange={event => setEmail(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Email:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="email" value={emailConfirm} onChange={event => setEmailConfirm(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="password" value={password} onChange={event => setPassword(event.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)} />
                </Form.Group>
                <Button style={{width: '300px'}} variant="primary" type="submit">
                    Register
                </Button>
                <p className="mt-2">
                    Already registered? <a href="/login">Login</a>
                </p>
            </Form>
        </div>
    );
};

export default RegisterPage;
