import { prisma } from "./db";
import { stripe } from "./stripe";

type SaveSubscriptionParams = {
  subscriptionId: string;
  customerId: string;
  createAction?: boolean;
};

export const saveSubscription = async ({
  customerId,
  subscriptionId,
  createAction = false,
}: SaveSubscriptionParams) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const product = subscription.items.data[0]!.price.product;

    if (createAction) {
      const plan = await prisma.plan.findFirst({
        where: {
          stripeProductId: product.toString(),
        },
      });

      await prisma.subscription.create({
        data: {
          amount: subscription.items.data[0]!.price.unit_amount!,
          currentPeriodEnd: subscription.current_period_end,
          currentPeriodStart: subscription.current_period_start,
          latestInvoiceId: subscription.latest_invoice!.toString(),
          status: subscription.status,
          stripePriceId: subscription.items.data[0]!.price.id,
          stripeSubscriptionId: subscription.id,
          user: {
            connect: {
              id: user?.id,
            },
          },
          plan: {
            connect: {
              id: plan?.id,
            },
          },
        },
      });

      return;
    } else {
      const subscriptionExists = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
      });

      if (subscriptionExists) {
        await prisma.subscription.update({
          where: {
            id: subscriptionExists.id,
          },
          data: {
            status: subscription.status,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
