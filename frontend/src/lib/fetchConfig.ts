/**
 * Fetch Configuration
 * Centralized API configuration with token handling and error management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// Error types for better error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network error occurred") {
    super(message);
    this.name = "NetworkError";
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Session has expired. Please login again.");
    this.name = "SessionExpiredError";
  }
}

// Token management utilities
export const TokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  getSessionToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("sessionToken");
  },

  setTokens: (token: string, sessionToken: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    localStorage.setItem("sessionToken", sessionToken);
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("sessionToken");
  },

  hasToken: (): boolean => {
    return !!TokenManager.getToken();
  },
};

// Request options type
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

// Build URL with query parameters
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Get default headers
function getDefaultHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = TokenManager.getToken();
  const sessionToken = TokenManager.getSessionToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (sessionToken) {
    headers["X-Session-Token"] = sessionToken;
  }

  return headers;
}

// Handle response errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { message?: string; code?: string } = {};

    try {
      errorData = await response.json();
    } catch {
      // Response body might not be JSON
    }

    // Handle session expired
    if (errorData.code === "SESSION_INVALID" || response.status === 401) {
      TokenManager.clearTokens();

      if (typeof window !== "undefined" && response.status === 401) {
        // Only redirect on session invalid, not on failed login
        if (errorData.code === "SESSION_INVALID") {
          window.location.href = "/login?session_expired=true";
        }
      }

      throw new SessionExpiredError();
    }

    throw new ApiError(
      response.status,
      errorData.code || "UNKNOWN_ERROR",
      errorData.message || `HTTP error ${response.status}`,
      errorData
    );
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return {} as T;
  }

  return response.json();
}

// Main fetch function
async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...getDefaultHeaders(),
      ...customHeaders,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError || error instanceof SessionExpiredError) {
      throw error;
    }

    throw new NetworkError(
      error instanceof Error ? error.message : "Unknown network error"
    );
  }
}

// HTTP method helpers
export const api = {
  get: <T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> => fetchApi<T>(endpoint, { method: "GET", params }),

  post: <T = unknown>(endpoint: string, body?: unknown): Promise<T> =>
    fetchApi<T>(endpoint, { method: "POST", body }),

  put: <T = unknown>(endpoint: string, body?: unknown): Promise<T> =>
    fetchApi<T>(endpoint, { method: "PUT", body }),

  patch: <T = unknown>(endpoint: string, body?: unknown): Promise<T> =>
    fetchApi<T>(endpoint, { method: "PATCH", body }),

  delete: <T = unknown>(endpoint: string): Promise<T> =>
    fetchApi<T>(endpoint, { method: "DELETE" }),
};

export default api;
