/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { sendEmail } from "@/email";
import WelcomeEmail from "@/email/welcome";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Onboarding } from "@prisma/client";
import { compare } from "bcryptjs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
  type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

type UserRole =
  | "ADMIN_SYSTEM"
  | "ADMIN_COMPANY"
  | "MEMBER_COMPANY"
  | "PROFESSIONAL";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role?: UserRole;
      createdAt?: Date;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    onboarding: Onboarding | null;
    createdAt?: Date;
  }
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    // EmailProvider({
    //   sendVerificationRequest({ identifier, url }) {
    //     if (process.env.NODE_ENV === "development") {
    //       console.log(`Login link: ${url}`);
    //       return;
    //     } else {
    //     void sendEmail({
    //       email: identifier,
    //       subject: "Seu link de login do Bebiss",
    //       react: LoginLink({ url, email: identifier }),
    //     });
    //     }
    //   },
    // }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "alan@bebiss.com.br",
        },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findFirst({
            where: {
              email,
            },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              password: true,
              onboarding: true,
              createdAt: true,
            },
          });

          if (!user) return null;

          const isValidPassword = await compare(password, user.password!);

          if (!isValidPassword) return null;

          console.log(user);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            onboarding: user.onboarding,
            createdAt: user.createdAt,
          };
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
  },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? ".bebiss.com.br" : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    session: ({ session, token }) => {
      // console.log(token);
      return {
        ...session,
        token: {
          ...token,
          ALAN: "GABRIEL",
        },
        user: {
          ...session.user,
          id: token.sub,
          // @ts-ignore
          role: token.user.role,
          // @ts-ignore
          onboarding: token.user.onboarding,
          // @ts-ignore
          createdAt: token.user.createdAt,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      // @ts-ignore
      if (!token?.user?.onboarding) {
        const onboarding = await prisma.onboarding.findUnique({
          where: {
            userId: token.sub,
          },
        });
        // @ts-ignore
        token.user.onboarding = onboarding;
      }

      return token;
    },
  },
  events: {
    async signIn({ user }) {
      const email = user.email as string;
      const welcomeOnboarding = user.onboarding?.step === "WELCOME";

      if (
        user?.createdAt &&
        new Date(user.createdAt).getTime() > Date.now() - 10000
      ) {
        if (!welcomeOnboarding) {
          await prisma.onboarding.create({
            data: {
              step: "WELCOME",
              userId: user.id,
            },
          });
        }

        void sendEmail({
          subject: "Bem vindo à Bebiss!",
          email,
          react: WelcomeEmail({
            email,
            name: user.name || null,
          }),
          marketing: true,
        });

        return;
      }
    },
  },
  // debug: true,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
