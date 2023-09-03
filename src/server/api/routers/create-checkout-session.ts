import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/stripe";

const createCheckoutSessionSchema = z.object({
  stripePriceId: z.string(),
  companyId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const checkoutSessionRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { stripePriceId, cancelUrl, successUrl, companyId } = input;
      const {
        user: { email },
      } = ctx.session;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: email as string,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer_email: email as string,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: companyId,
      });

      return {
        sessionId: stripeCheckoutSession.id,
      };
    }),
});
