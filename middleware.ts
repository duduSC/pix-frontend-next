import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const freeRoutes = ["/usuarios/form", "/login"]

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    console.log(pathname)
    if (pathname === "/") {
        return NextResponse.next()
    }
    if (freeRoutes.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    try {
        const token = req.cookies.get("token")
        if (!token) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("error", "unauthorized");
            return NextResponse.redirect(loginUrl)
        }
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
