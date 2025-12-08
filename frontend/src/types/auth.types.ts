/**
 * Authentication Types
 */

// User role types
export type UserRole = "student" | "admin";

// Base user interface
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt?: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
}

// Register request payload
export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// Register response
export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
  sessionToken: string;
}

// Logout response
export interface LogoutResponse {
  message: string;
}

// Get current user response
export interface MeResponse {
  user: User;
}

// Auth state for store
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth actions for store
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Combined auth store type
export type AuthStore = AuthState & AuthActions;
