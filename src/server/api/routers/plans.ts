import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/stripe";

export const createPlanSchema = z.object({
  name: z.string().nonempty({ message: "Name is required." }),
  interval: z.enum(["month", "quarter", "semiannual", "year"]),
  price: z
    .number({
      required_error: "Price is required.",
    })
    .min(1, { message: "Price must be greater than 0." }),
  active: z.boolean(),
  benefits: z.array(z.string()),
});

const getPlansSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

const intervalMapper = {
  month: {
    interval: "month",
    interval_count: 1,
  },
  quarter: {
    interval: "month",
    interval_count: 3,
  },
  semiannual: {
    interval: "month",
    interval_count: 6,
  },
  year: {
    interval: "year",
    interval_count: 1,
  },
} as const;

export const createPlanRouter = createTRPCRouter({
  createPlan: protectedProcedure
    .input(createPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { interval, name, price, active, benefits } = input;
      const {
        user: { role, name: userName, email },
      } = ctx.session;

      if (role !== "ADMIN_SYSTEM") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a plan",
        });
      }

      const priceInCents = Math.round(Number(price) * 100);

      const stripeProduct = await stripe.products.create({
        name,
        metadata: {
          benefits: benefits.join(", "),
          createBy: `${userName!} <${email!}>`,
        },
        default_price_data: {
          unit_amount: priceInCents,
          currency: "brl",
          recurring: {
            ...intervalMapper[interval],
          },
        },
        expand: ["default_price"],
      });

      const stripePrice = stripeProduct.default_price as Stripe.Price;

      const product = await ctx.prisma.plan.create({
        data: {
          name,
          active,
          interval,
          priceInCents,
          benefits,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      });

      return {
        ...product,
      };
    }),
  getPlans: protectedProcedure
    .input(getPlansSchema)
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 10 } = input;
      const {
        user: { role },
      } = ctx.session;

      if (role !== "ADMIN_SYSTEM") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to get plans",
        });
      }

      const plans = await ctx.prisma.plan.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const count = await ctx.prisma.plan.count();

      return {
        plans,
        count,
        totalPages: Math.ceil(count / limit),
        limit,
      };
    }),
});
