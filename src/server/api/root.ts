import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./routers/user";
import { companiesRouter } from "./routers/companies";
import { brasilAPIRouter } from "./routers/brasil-api";
import { onboardingRouter } from "./routers/onboarding";
import { checkoutSessionRouter } from "./routers/create-checkout-session";
import { clientsRouter } from "./routers/clients";
import { hustAppRouter } from "./routers/hust";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  companies: companiesRouter,
  brasilAPI: brasilAPIRouter,
  checkout: checkoutSessionRouter,
  onboarding: onboardingRouter,
  clients: clientsRouter,
  hust: hustAppRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
