import { log } from "@/lib/log";
import { prisma } from "./db";
import { stripe } from "./stripe";
import qs from "query-string";
import { newSubscriptionDiscordMessage } from "@/lib/log/messages";
import { getPlanFromPriceId } from "@/utils/plans";

type Create = {
  createAction: true;
  companyId: string;
};

type Update = {
  createAction?: false;
  companyId?: string;
};

type SaveSubscriptionParams = {
  subscriptionId: string;
  customerId: string;
  customerEmail?: string;
} & (Create | Update);

const recurringInterval = {
  month: "mensal",
  year: "anual",
};

export const saveSubscription = async ({
  customerId,
  subscriptionId,
  createAction = false,
  companyId,
  customerEmail,
}: SaveSubscriptionParams) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: customerEmail,
      },
    });

    if (!user) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]!.price.id;
    const interval = subscription.items.data[0]!.price.recurring!.interval;
    const plan = getPlanFromPriceId(priceId);
    const period = recurringInterval[interval as "month" | "year"];

    console.log({
      subscriptionId,
      customerId,
      createAction,
      companyId,
    });

    if (createAction) {
      const company = await prisma.company.update({
        where: {
          id: companyId,
        },
        data: {
          stripeCustomerId: customerId,
          plan: "pro",
          stripePriceId: subscription.items.data[0]!.price.id,
          billingCycleStart: new Date().getDate(),
          stripeSubscriptionId: subscriptionId,
        },
      });

      const query = qs.stringify({
        type: "whatsapp",
        id: companyId,
      });

      await prisma.onboarding.update({
        where: {
          userId: user.id,
        },
        data: {
          step: "CONNECT_WHATSAPP",
          query,
        },
      });

      await log({
        type: "new-subscription",
        message: newSubscriptionDiscordMessage({
          companyName: company.name,
          createdAt: subscription.created.toString(),
          period,
          plan: plan.name,
          value: subscription.items.data[0]!.price.unit_amount! / 100,
        }),
      });

      return;
    }

    const subscriptionPlan = subscription.status === "active" ? "pro" : "free";

    await prisma.company.update({
      where: {
        id: companyId,
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        plan: subscriptionPlan,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
