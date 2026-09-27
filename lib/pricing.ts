import { services } from "./config";

export type PriceQuote = {
  base: number;
  discount: number;
  tax: number;
  total: number;
  currency: "INR";
};

export function quoteForService(slug: string, discount = 0, taxRate = 0) {
  const item = services.find((s) => s.slug === slug);
  if (!item) throw new Error("Unknown service");
  const base = item.price;
  const discountAmount = Math.min(Math.max(discount, 0), base);
  const taxable = base - discountAmount;
  const tax = Math.round(taxable * taxRate);
  return {
    base,
    discount: discountAmount,
    tax,
    total: taxable + tax,
    currency: "INR" as const,
  };
}
