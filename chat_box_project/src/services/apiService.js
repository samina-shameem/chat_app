import useAxiosPrivate from "../components/hooks/useAxiosPrivate";
import useAuth from "./useAuth"; // Adjust import path as needed

// Function to register a new user (requires CSRF)
export const registerUser = async (userData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to log in and generate a new token (requires CSRF)
export const generateAuthToken = async (loginData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.post('/auth/token', loginData);
    return response.data;
  } catch (error) {
    console.error('Error generating auth token:', error);
    throw error;
  }
};

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.patch('/csrf');
    return response.data.csrfToken; // Assuming response contains csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Function to generate a new token (for refreshing expired tokens)
export const generateToken = async () => {
  const { username, password } = useAuth().auth; // or pass auth directly if preferred

  if (!username || !password) {
    throw new Error("No username or password found for token generation");
  }

  const loginData = { username, password };
  try {
    const response = await generateAuthToken(loginData);
    // Assuming the response contains a new token
    const { token } = response;
    return token;
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    throw error;
  }
};

// Function to fetch all messages (requires JWT)
export const getAllMessages = async () => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.get('/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Function to create a new message (requires JWT)
export const createMessage = async (messageData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Function to delete a message (requires JWT)
export const deleteMessage = async (messageId) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Function to fetch all users (requires JWT)
export const getAllUsers = async () => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to fetch a specific user by ID (requires JWT)
export const getUserById = async (userId) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Function to update a user (requires JWT)
export const updateUser = async (userData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.put('/user', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Function to delete a user by ID (requires JWT)
export const deleteUserById = async (userId) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
