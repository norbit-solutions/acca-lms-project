import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestMethod = request.method;
  const timestamp = new Date().toISOString();

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  
  // DEBUG: Log all incoming requests
  console.log(`[PROXY DEBUG ${timestamp}] ===== REQUEST START =====`);
  console.log(`[PROXY DEBUG] Path: ${pathname}`);
  console.log(`[PROXY DEBUG] Method: ${requestMethod}`);
  console.log(`[PROXY DEBUG] Token present: ${!!token}`);
  console.log(`[PROXY DEBUG] Token value (first 20 chars): ${token ? token.substring(0, 20) + '...' : 'NONE'}`);
  console.log(`[PROXY DEBUG] SessionToken present: ${!!sessionToken}`);
  console.log(`[PROXY DEBUG] All cookies: ${request.cookies.getAll().map(c => c.name).join(', ') || 'NO COOKIES'}`);
  console.log(`[PROXY DEBUG] API_BASE_URL: ${API_BASE_URL}`);
  console.log(`[PROXY DEBUG] Headers Origin: ${request.headers.get('origin')}`);
  console.log(`[PROXY DEBUG] Headers Host: ${request.headers.get('host')}`);
  console.log(`[PROXY DEBUG] Headers Referer: ${request.headers.get('referer')}`);
  console.log(`[PROXY DEBUG] Headers Cookie: ${request.headers.get('cookie') || 'NO COOKIE HEADER'}`);

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
    console.log(`[PROXY DEBUG] Matched /admin route`);
    
    if (!token) {
      console.log(`[PROXY DEBUG] NO TOKEN FOUND - Redirecting to /login`);
      console.log(`[PROXY DEBUG] Redirect URL: ${new URL("/login", request.url).toString()}`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log(`[PROXY DEBUG] Token found, calling API: ${API_BASE_URL}/auth/me`);
    
    try {
      const fetchStartTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(sessionToken && { "X-Session-Token": sessionToken }),
        },
      });
      const fetchDuration = Date.now() - fetchStartTime;
      
      console.log(`[PROXY DEBUG] API Response status: ${response.status}`);
      console.log(`[PROXY DEBUG] API Response ok: ${response.ok}`);
      console.log(`[PROXY DEBUG] API call duration: ${fetchDuration}ms`);

      if (!response.ok) {
        // Token invalid - redirect to login
        const responseText = await response.text();
        console.log(`[PROXY DEBUG] API Response body: ${responseText}`);
        console.log(`[PROXY DEBUG] Token invalid - Redirecting to /login and clearing cookies`);
        
        const loginUrl = new URL("/login", request.url);
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("token");
        res.cookies.delete("sessionToken");
        return res;
      }

      const data = await response.json();
      console.log(`[PROXY DEBUG] User data received:`, JSON.stringify(data.user ? { id: data.user.id, role: data.user.role, email: data.user.email } : 'NO USER'));

      // Check if user is admin - non-admins go to dashboard
      if (data.user?.role !== "admin") {
        console.log(`[PROXY DEBUG] User role is '${data.user?.role}' (not admin) - Redirecting to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      console.log(`[PROXY DEBUG] User is admin - Allowing access to /admin`);
      return NextResponse.next();
    } catch (error) {
      console.log(`[PROXY DEBUG] FETCH ERROR:`, error instanceof Error ? error.message : String(error));
      console.log(`[PROXY DEBUG] Error stack:`, error instanceof Error ? error.stack : 'N/A');
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
