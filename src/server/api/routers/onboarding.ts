/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import qs from "query-string";

const changeStep = z.object({
  step: z.enum([
    "WELCOME",
    "CREATE_COMPANY",
    "UPGRADE",
    "CONNECT_WHATSAPP",
    "CONNECT_CALENDAR",
    "COMPLETE_SETUP",
  ]),
  query: z.record(z.string()).optional(),
});

export const onboardingRouter = createTRPCRouter({
  changeStep: protectedProcedure
    .input(changeStep)
    .mutation(async ({ ctx, input }) => {
      const { step, query } = input;
      const querystring = qs.stringify(query || {});
      const { user } = ctx.session;

      await ctx.prisma.onboarding.update({
        where: {
          userId: user.id,
        },
        data: {
          step,
          query: querystring,
        },
      });
    }),
});
