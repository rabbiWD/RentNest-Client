import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Protected Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    // 1. Redirect unauthenticated users to login
    if (!accessToken && !userRole) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Role-Based Access Control (RBAC) Protection
    if (userRole) {
      // Admin Portal: Only ADMIN role allowed
      if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
        const fallbackDashboard =
          userRole === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/tenant";
        return NextResponse.redirect(new URL(fallbackDashboard, request.url));
      }

      // Landlord Portal: Only LANDLORD and ADMIN roles allowed
      if (pathname.startsWith("/dashboard/landlord") && userRole === "TENANT") {
        return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
      }
    }
  }

  // Redirect authenticated users away from login & register pages
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
    if (accessToken && userRole) {
      const dashboardPath =
        userRole === "ADMIN"
          ? "/dashboard/admin"
          : userRole === "LANDLORD"
          ? "/dashboard/landlord"
          : "/dashboard/tenant";

      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
