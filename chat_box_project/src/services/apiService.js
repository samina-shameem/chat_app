import useAuth from "../components/hooks/useAuth";
import useAxiosPrivate from "../components/hooks/useAxiosPrivate";


// Function to register a new user (requires CSRF)
export const registerUser = async (userData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.post('/auth/register', userData);
    console.info('Registered user successfully');
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to log in and generate a new token (requires CSRF)
export const loginService = async (loginData) => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.post('/auth/token', loginData);
    console.info('Logged in successfully');
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
    console.debug('Fetched CSRF token');
    return response.data.csrfToken; // Assuming response contains csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Function to generate a new token (for refreshing expired tokens)
export const generateToken = async () => {
  const { username, password } = useAuth();

  if (!username || !password) {
    throw new Error("No username or password found for token generation");
  }

  const loginData = { username, password };
  try {
    const response = await loginService(loginData);
    // Assuming the response contains a new token
    const { token } = response;
    console.info('Generated new token');
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
    console.info('Fetched all messages');
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
    console.info('Created new message');
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
    console.info('Deleted message');
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
    console.info('Fetched all users');
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
    console.info('Fetched user by ID');
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
    console.info('Updated user');
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
    console.info('Deleted user');
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

