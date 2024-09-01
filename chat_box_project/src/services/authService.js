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

export const registerService = async (username, email, password) => {
    // Mocked registration service
    return { id: 2, username, email, avatar: '' };
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
