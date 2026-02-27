import { TokenManager } from "@/lib/fetchConfig";
import { authService } from "@/services";
import type { AuthStore, RegisterRequest, User } from "@/types";
import { create } from "zustand";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  setUnauthenticated: () => set({ user: null, isAuthenticated: false, isLoading: false }),

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
    if (!(await TokenManager.hasValidSession())) {
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
