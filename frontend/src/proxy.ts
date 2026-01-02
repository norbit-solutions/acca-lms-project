import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  // Handle /admin/login - redirect authenticated users
  if (pathname === "/login" || pathname === "/register") {
    if (!token) {
      return NextResponse.next();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(sessionToken && { "X-Session-Token": sessionToken }),
        },
      });

      if (!response.ok) {
        // Token invalid - clear cookies and show login page
        const res = NextResponse.next();
        res.cookies.delete("token");
        res.cookies.delete("sessionToken");
        return res;
      }

      const data = await response.json();

      // User has valid token - redirect based on role
      if (data.user?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Network error - show login page
      return NextResponse.next();
    }
  }

  // Handle /admin/* routes - protect them (admin only)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(sessionToken && { "X-Session-Token": sessionToken }),
        },
      });

      if (!response.ok) {
        // Token invalid - redirect to login
        const loginUrl = new URL("/login", request.url);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("token");
        res.cookies.delete("sessionToken");
        return res;
      }

      const data = await response.json();

      // Check if user is admin - non-admins go to dashboard
      if (data.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.next();
    }
  }

  // Handle /dashboard/* routes - protect them (authenticated users only)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(sessionToken && { "X-Session-Token": sessionToken }),
        },
      });

      if (!response.ok) {
        // Token invalid - redirect to login
        const loginUrl = new URL("/login", request.url);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("token");
        res.cookies.delete("sessionToken");
        return res;
      }

      const data = await response.json();

      // Admins should use admin dashboard
      if (data.user?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
