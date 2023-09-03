/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type User } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { conn } from "./lib/planetscale";

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

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: string;
//   password: string;
//   stripeCustomerId?: string;
//   role: UserRole;
//   createdAt: string;
// };

const rolesConfig = {
  ADMIN_SYSTEM: {
    route: "/admin",
  },
  ADMIN_COMPANY: {
    route: "/app",
  },
  MEMBER_COMPANY: {
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

  if (
    (session?.user?.createdAt &&
      new Date(session?.user?.createdAt).getTime() > Date.now() - 10000) ||
    (session?.user && session.user?.onboarding?.step !== "COMPLETE_SETUP")
  ) {
    const search = req.nextUrl.search.substring(1);
    // select step, query de Onboarding quando userId
    const onboarding = await conn
      ?.execute("SELECT step, query FROM Onboarding WHERE userId = ?", [
        session.sub,
      ])
      .then(
        (res) => res.rows[0] as { step: string; query?: string } | undefined
      );

    if (onboarding?.step === "COMPLETE_SETUP") return;

    if (
      (path === "/app/welcome" && onboarding?.step === "WELCOME") ||
      search === onboarding?.query
    )
      return;

    const query = onboarding?.query ? `?${onboarding?.query}` : "";
    return NextResponse.redirect(new URL(`/app/welcome${query}`, req.url));
  }

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
    "/((?!api/|_next/|_proxy/|images|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
