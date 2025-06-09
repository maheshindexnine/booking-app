import { create } from "zustand";
import { Auth, User, UserRole } from "@/types";
import { authService } from "@/services/auth";

interface AuthState {
  user: Auth | null;
  token: string;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<void>;
  logout: () => void;
}

// Initialize state from localStorage if available
const getInitialState = () => {
  if (typeof window === "undefined") return { user: null, token: "" };

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || "",
  };
};

export const useAuth = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.loginUser({ email, password });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // add data to localStorage
      const { access_token } = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);
      set({ user, token: access_token, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  register: async (userData: Omit<User, "id" | "createdAt">) => {
    set({ isLoading: true, error: null });

    try {
      const user: Auth = await authService.register(userData);
      if (!user) {
        throw new Error("Failed to register");
      }

      // add data to localStorage
      const { access_token } = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);
      set({ user, token: access_token, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: "" });
  },
}));

export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "user":
      return "/movies";
    default:
      return "/";
  }
};
