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
  getToken: async (): Promise<string | null> => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get("token")?.value || null;
    } catch {
      return null;
    }
  },

  getSessionToken: async (): Promise<string | null> => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sessionToken");
    }
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get("sessionToken")?.value || null;
    } catch {
      return null;
    }
  },

  setTokens: (token: string, sessionToken: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    localStorage.setItem("sessionToken", sessionToken);

    // DEBUG: Log token setting
    const isSecure = window.location.protocol === 'https:';
    const hostname = window.location.hostname;
    console.log(`[AUTH DEBUG] Setting tokens`);
    console.log(`[AUTH DEBUG] Protocol: ${window.location.protocol}`);
    console.log(`[AUTH DEBUG] Hostname: ${hostname}`);
    console.log(`[AUTH DEBUG] isSecure (HTTPS): ${isSecure}`);
    console.log(`[AUTH DEBUG] Token (first 20 chars): ${token.substring(0, 20)}...`);

    // Set cookies for server-side access
    // Use Secure flag on HTTPS, and SameSite=Lax
    const cookieBase = `path=/; max-age=604800; SameSite=Lax`;
    const cookieSuffix = isSecure ? `; Secure` : '';
    
    const tokenCookie = `token=${token}; ${cookieBase}${cookieSuffix}`;
    const sessionCookie = `sessionToken=${sessionToken}; ${cookieBase}${cookieSuffix}`;
    
    console.log(`[AUTH DEBUG] Token cookie string: token=<redacted>; ${cookieBase}${cookieSuffix}`);
    console.log(`[AUTH DEBUG] Session cookie string: sessionToken=<redacted>; ${cookieBase}${cookieSuffix}`);
    
    document.cookie = tokenCookie;
    document.cookie = sessionCookie;
    
    // Verify cookies were set
    setTimeout(() => {
      console.log(`[AUTH DEBUG] Cookies after setting: ${document.cookie}`);
      console.log(`[AUTH DEBUG] Token in localStorage: ${localStorage.getItem('token') ? 'YES' : 'NO'}`);
    }, 100);
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("sessionToken");

    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },

  hasToken: async (): Promise<boolean> => {
    const token = await TokenManager.getToken();
    return !!token;
  },

  hasValidSession: async (): Promise<boolean> => {
    const [token, sessionToken] = await Promise.all([
      TokenManager.getToken(),
      TokenManager.getSessionToken(),
    ]);

    return !!token && !!sessionToken;
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
async function getDefaultHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = await TokenManager.getToken();
  const sessionToken = await TokenManager.getSessionToken();

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

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:expired"));
      }

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
      ...(await getDefaultHeaders()),
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

  delete: <T = unknown>(endpoint: string, body?: unknown): Promise<T> =>
    fetchApi<T>(endpoint, { method: "DELETE", body }),
};

export default api;
