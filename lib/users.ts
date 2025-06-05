import { create } from 'zustand';
import { User } from '@/types';
import { userService } from '@/services/userService';

// Store
interface UserState {
  users: User[];
  selectedUser: User | null;

  // Actions
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => User | undefined;
  selectUser: (user: User) => void;
  clearSelectedUser: () => void;

  // CRUD Operations
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,

  // Get all users
  getUsers: async () => {
    try {
      const users = await userService.getUsers();
      set({ users });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return get().users; // Return existing users if API call fails
    }
  },

  // Get user by ID
  getUserById: (id) => get().users.find(user => user.id === id),

  // Select user
  selectUser: (user) => set({ selectedUser: user }),

  // Clear selected user
  clearSelectedUser: () => set({ selectedUser: null }),

  // Add new user
  addUser: async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      set(state => ({ users: [...state.users, newUser] }));
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, data) => {
    try {
      const updatedUser = await userService.updateUser(id, data);
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: (id) => {
    set(state => ({
      users: state.users.filter(user => user.id !== id)
    }));
  },
})); 