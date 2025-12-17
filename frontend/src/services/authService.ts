/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import api, { TokenManager } from "@/lib/fetchConfig";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  MeResponse,
} from "@/types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
} as const;

export const authService = {
  /**
   * Login user with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);

    // Store tokens after successful login
    if (response.token && response.sessionToken) {
      TokenManager.setTokens(response.token, response.sessionToken);
    }

    return response;
  },

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );

    // Store tokens after successful registration
    if (response.token && response.sessionToken) {
      TokenManager.setTokens(response.token, response.sessionToken);
    }

    return response;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);
      return response;
    } finally {
      // Always clear tokens, even if logout fails
      TokenManager.clearTokens();
    }
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<MeResponse> {
    return api.get<MeResponse>(AUTH_ENDPOINTS.ME);
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return TokenManager.hasToken();
  },
};

export default authService;
