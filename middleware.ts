import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get JWT token from cookies
  const token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userId = payload.id || payload.userId;

      // Redirect logged-in users away from sign-in/sign-up
      if (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up")
      ) {
        url.pathname = `/${userId}`;
        return NextResponse.redirect(url);
      }

      // Redirect "/" to /[userId]
      if (url.pathname === "/") {
        url.pathname = `/${userId}`;
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error("Invalid token in middleware:", err);
      // optionally clear invalid token
    }
  } else {
    // Not logged in → redirect protected routes to sign-in
    const protectedPaths = ["/board", "/[id]"];
    if (protectedPaths.some((path) => url.pathname.startsWith(path))) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
