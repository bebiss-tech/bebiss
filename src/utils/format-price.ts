export default function formatPrice(
  price: number | bigint | undefined
): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price || 0);
}
