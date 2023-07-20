import { type UserRole } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up", "/"];

type Session = {
  name: string;
  email: string;
  sub: string;
  user: User;
  iat: number;
  exp: number;
  jti: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  password: string;
  stripeCustomerId?: string;
  role: UserRole;
  createdAt: string;
};

const rolesConfig = {
  ADMIN_SYSTEM: {
    route: "/admin",
  },
  ADMIN_COMPANY: {
    route: "/app",
  },
  PROFESSIONAL: {
    route: "/agenda",
  },
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Session;

  const userRole = session?.user?.role;
  const role = rolesConfig[userRole];

  if (userRole !== "ADMIN_SYSTEM" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole !== "ADMIN_COMPANY" && path.startsWith("/app")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole !== "PROFESSIONAL" && path.startsWith("/agenda")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session?.email && !AUTH_PATHS.includes(path)) {
    return NextResponse.redirect(new URL(`/auth/sign-in`, req.url));
  }

  if (session?.email && AUTH_PATHS.includes(path)) {
    return NextResponse.redirect(new URL(role.route, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
