import { type NextApiRequest, type NextApiResponse } from "next";
import { type Readable } from "stream";
import type Stripe from "stripe";
import { env } from "@/env.mjs";
import { saveSubscription } from "@/server/manage-subscription";
import { stripe } from "@/server/stripe";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "product.created",
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const secret = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    if (!(err instanceof Error)) return res.status(400).send("Webhook error");

    return res.status(400).send(`Webhook error: ${err?.message}`);
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;

          await saveSubscription({
            customerId: subscription.customer?.toString(),
            subscriptionId: subscription.id,
          });

          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          await saveSubscription({
            customerId: checkoutSession.customer?.toString() as string,
            subscriptionId: checkoutSession.subscription?.toString() as string,
            createAction: true,
          });

          break;
        default:
          throw new Error("Unhandled event.");
      }
    } catch (err) {
      return res.json({ error: "Webhook handler failed" });
    }
  }

  res.json({ received: true });
};
