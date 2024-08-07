/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Stripe as StripeProps, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<StripeProps | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");
  }

  return stripePromise;
};
