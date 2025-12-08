import { create } from "zustand";
import { authService } from "@/services";
import { TokenManager } from "@/lib/fetchConfig";
import type { User, RegisterRequest, AuthStore } from "@/types";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),

  login: async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    set({ user: response.user, isAuthenticated: true });
  },

  register: async (data: RegisterRequest) => {
    const response = await authService.register(data);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout - tokens are cleared in the service
    }
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    if (!TokenManager.hasToken()) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await authService.me();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      TokenManager.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
