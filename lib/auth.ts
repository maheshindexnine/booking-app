import { create } from 'zustand';
import { User, UserRole } from '@/types';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '1234567890',
    type: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Vendor User',
    email: 'vendor@example.com',
    phone: '2345678901',
    type: 'vendor',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@example.com',
    phone: '3456789012',
    type: 'user',
    createdAt: new Date().toISOString(),
  },
];

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Find user with matching email
      const user = mockUsers.find(user => user.email === email);
      
      // In a real app, we would validate the password here
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Check if email is already in use
      if (mockUsers.some(user => user.email === userData.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be saved to a database)
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      
      // Add to mock users (this would be a database operation in a real app)
      mockUsers.push(newUser);
      
      set({ user: newUser, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    set({ user: null });
  },
}));

export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'vendor':
      return '/vendor/dashboard';
    case 'user':
      return '/movies';
    default:
      return '/';
  }
};