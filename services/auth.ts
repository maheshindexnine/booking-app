import { Auth, User } from "@/types";
import api from "./api";

export const authService = {
  loginUser: async (userData: {
    email: string;
    password: string;
  }): Promise<Auth> => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error) {
      console.error("Error while logging in:", error);
      throw error;
    }
  },

  register: async (userData: Omit<User, "id" | "createdAt">): Promise<Auth> => {
    try {
      const response = await api.post(`/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error while registering user:`, error);
      throw error;
    }
  },
};
