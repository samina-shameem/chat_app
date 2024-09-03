import React from 'react';

import { Form, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [emailConfirm, setEmailConfirm] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (email !== emailConfirm) {
            setEmailError('Email confirmation does not match');
        } else {
            setEmailError('');
        }
    };

    const handleEmailConfirmChange = (event) => {
        setEmailConfirm(event.target.value);
        if (email !== emailConfirm) {
            setEmailError('Email confirmation does not match');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (password !== passwordConfirm) {
            setPasswordError('Password confirmation does not match');
        } else {
            setPasswordError('');
        }
    };

    const handlePasswordConfirmChange = (event) => {
        setPasswordConfirm(event.target.value);
        if (password !== passwordConfirm) {
            setPasswordError('Password confirmation does not match');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (email !== emailConfirm) {
            alert('Email confirmation does not match');
            return;
        }
        if (password !== passwordConfirm) {
            alert('Password confirmation does not match');
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
                    <Form.Control style={{width: '300px'}} type="email" value={email} onChange={handleEmailChange} />
                    {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Email:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="email" value={emailConfirm} onChange={handleEmailConfirmChange} />
                    {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="password" value={password} onChange={handlePasswordChange} />
                    {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control style={{width: '300px'}} type="password" value={passwordConfirm} onChange={handlePasswordConfirmChange} />
                    {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                </Form.Group>
                <Button style={{width: '300px'}} variant="primary" type="submit">
                    Register
                </Button>
                <p className="mt-2">
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </Form>
        </div>
    );
};

export default RegisterPage;
