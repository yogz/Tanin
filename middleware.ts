import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "tanin_session";

export function middleware(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE_NAME);
    const isLoginPage = request.nextUrl.pathname === "/login";

    // If trying to access login page while authenticated, redirect to home
    if (isLoginPage && session) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If trying to access protected pages without authentication, redirect to login
    if (!isLoginPage && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
