export function getPlanFromPriceId(priceId: string) {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "production" : "test";
  return PLANS.find(
    (plan) =>
      plan.price.mensal.priceIds[env] === priceId ||
      plan.price.anual.priceIds[env] === priceId
  )!;
}

export const PLANS = [
  {
    name: "Pro",
    slug: "pro",
    price: {
      mensal: {
        amount: 297,
        priceIds: {
          test: "price_1NfPfxGCr9HkzvsBkcTPP4Hj",
          // TODO: Change to production price id
          production: "price_1NfPfxGCr9HkzvsBkcTPP4Hj",
        },
      },
      anual: {
        amount: 297 * 10,
        priceIds: {
          test: "price_1NfPfxGCr9HkzvsBlINtbXlM",
          // TODO: Change to production price id
          production: "price_1NfPfxGCr9HkzvsBlINtbXlM",
        },
      },
    },
  },
  {
    name: "Pro Adicional",
    slug: "pro-adicional",
    price: {
      mensal: {
        amount: 207,
        priceIds: {
          test: "price_1NfPgZGCr9HkzvsBmls6UoY9",
          // TODO: Change to production price id
          production: "price_1NfPgZGCr9HkzvsBmls6UoY9",
        },
      },
      anual: {
        amount: 207 * 10,
        priceIds: {
          test: "price_1NfPgwGCr9HkzvsBLkgiLp3I",
          // TODO: Change to production price id
          production: "price_1NfPgwGCr9HkzvsBLkgiLp3I",
        },
      },
    },
  },
];
