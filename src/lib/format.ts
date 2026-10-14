/*
  Formatting helpers. Monetary values are integer CENTS throughout the app
  (integer-safe math); formatting is the only place they become display strings.

  Currency is set to match the WooCommerce store (INR). If you change the store
  currency, update the formatter below.
*/

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 21200 (cents/paise) -> "₹212.00" */
export function formatMoney(cents: number): string {
  return money.format(cents / 100);
}

const groupedNumber = new Intl.NumberFormat("en-IN");

/** 12000 -> "12,000" */
export function formatNumber(value: number): string {
  return groupedNumber.format(value);
}
