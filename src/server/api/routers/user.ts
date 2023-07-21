import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const createUserSchema = z.object({
  name: z.string().nonempty({ message: "Name is required." }),
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const userExists = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists.",
        });
      }

      const passwordHash = await hash(password, 6);

      const user = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          onboardings: {
            create: {
              step: "WELCOME",
            },
          },
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }),
});
