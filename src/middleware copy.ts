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
    route: "/p",
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

  if (userRole !== "ADMIN_SYSTEM" && path === "/admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole !== "ADMIN_COMPANY" && path === "/app") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRole !== "PROFESSIONAL" && path === "/p") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session?.email && !AUTH_PATHS.includes(path)) {
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in${
          path !== "/" ? `?next=${encodeURIComponent(path)}` : ""
        }`,
        req.url
      )
    );
  }

  if (session?.email && AUTH_PATHS.includes(path)) {
    return NextResponse.redirect(new URL(role.route, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
