import { create } from "zustand";
import { authApi } from "./api";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "student" | "admin";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user, token, sessionToken } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("sessionToken", sessionToken);

    set({ user, isAuthenticated: true });
  },

  register: async (data) => {
    const response = await authApi.register(data);
    const { user, token, sessionToken } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("sessionToken", sessionToken);

    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore errors on logout
    }
    localStorage.removeItem("token");
    localStorage.removeItem("sessionToken");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await authApi.me();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
