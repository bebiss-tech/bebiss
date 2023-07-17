import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions, getServerAuthSession } from "./auth";

// import { UserProps } from "../types";

export default async function AppMiddleware(
  req: NextRequest,
  res: NextResponse
) {
  const path = req.nextUrl.pathname;

  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  // as {
  //   email?: string;
  //   user?: DefaultSession["user"];
  // };
  // if there's no session and the path isn't /login or /register, redirect to /login
  // if (!session?.email && path !== "/login" && path !== "/register") {
  //   return NextResponse.redirect(
  //     new URL(
  //       `/login${path !== "/" ? `?next=${encodeURIComponent(path)}` : ""}`,
  //       req.url
  //     )
  //   );

  //   // if there's a session
  // } else if (session?.email) {
  //   // if the user was created in the last 10s and the path isn't /welcome, redirect to /welcome
  //   // (this is a workaround because the `isNewUser` flag is triggered when a user does `dangerousEmailAccountLinking`)
  //   if (
  //     session?.user?.createdAt &&
  //     new Date(session?.user?.createdAt).getTime() > Date.now() - 10000 &&
  //     path !== "/welcome"
  //   ) {
  //     return NextResponse.redirect(new URL("/welcome", req.url));

  //     // if the path is /login or /register, redirect to "/"
  //   } else if (path === "/login" || path === "/register") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  // otherwise, rewrite the path to /app
  // return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  return NextResponse.next();
}
