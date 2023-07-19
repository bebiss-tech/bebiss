/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env.mjs";

export async function getStripeJs() {
  const stripeJs = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripeJs;
}
