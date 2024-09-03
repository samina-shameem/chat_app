export const loginService = async (username, password) => {
    // Mocked login service
    if (username === 'user' && password === 'password') {
        return { id: 1, username: 'user', email: 'user@example.com', avatar: '' };
    }
    throw new Error('Invalid credentials');
};

export const logoutService = () => {
    // Mocked logout service
    console.log('User logged out');
};

export const getCsrfToken = async () => {
    const csrfResponse = await fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH'
    });
    return await csrfResponse.text();
};

export const registerService = async (username, password, email, avatar) => {
    const csrfToken = await getCsrfToken();

    const registerResponse = await fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            email,
            avatar,
            csrfToken
        })
    });

    if (!registerResponse.ok) {
        throw new Error('Registration failed');
    }
    const data = await registerResponse.json();
    return data;
};

export const getUserData = async () => {
    // Mocked get user data
    return { id: 1, username: 'user', email: 'user@example.com', avatar: '' };
};

export const updateProfileService = async (data) => {
    // Mocked update profile service
    return { id: 1, ...data };
};

export const deleteUserService = async () => {
    // Mocked delete user service
    console.log('User deleted');
};
