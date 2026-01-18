import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Duplicate enum to avoid importing mongoose model in edge runtime
enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COACH = 'COACH',
    STUDENT = 'STUDENT',
}

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isAuthenticated = !!token;

    // Protect Dashboard Routes
    if (pathname.startsWith("/super-admin") || pathname.startsWith("/coach") || pathname.startsWith("/student")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Role-based Access Control
    if (pathname.startsWith("/super-admin") && token?.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/coach") && token?.role !== UserRole.COACH) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Coach Approval Check
    if (token?.role === UserRole.COACH && pathname.startsWith("/coach")) {
        // Cast to any to access custom status property if TS complains, or rely on extended types
        const userStatus = (token as any).status;
        if (userStatus && userStatus !== 'APPROVED') {
            return NextResponse.redirect(new URL("/approval-status", req.url));
        }
    }

    if (pathname.startsWith("/student") && token?.role !== UserRole.STUDENT) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/super-admin/:path*", "/coach/:path*", "/student/:path*"],
};
