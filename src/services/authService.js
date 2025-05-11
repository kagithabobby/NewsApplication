// Mock user database (in a real app, this would be an API call to your backend)
const MOCK_USERS = [
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];

export const authService = {
  // Register a new user
  register: async (userData) => {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // In a real app, you would hash the password before storing
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add user to mock database
    MOCK_USERS.push(newUser);
    
    // Return user data without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}; 