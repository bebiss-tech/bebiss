import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(session?.email);

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
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/", "/", "/auth/sign-in", "/auth/sign-up"],
};
