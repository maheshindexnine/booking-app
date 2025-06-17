import { User } from '@/types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '1234567890',
    type: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'Vendor User',
    email: 'vendor@example.com',
    phone: '2345678901',
    type: 'vendor',
    createdAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@example.com',
    phone: '3456789012',
    type: 'user',
    createdAt: new Date('2024-01-03').toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
export const mockUserService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(500); // Simulate network delay
    return [...mockUsers];
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  // Create a new user
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      ...userData,
      id: String(mockUsers.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return { ...newUser };
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(400);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
    };
    return { ...mockUsers[userIndex] };
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await delay(300);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
  },
}; 