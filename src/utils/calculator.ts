import { BillItem } from '../types';

/**
 * Calculates total weight in kilograms from kilograms and grams.
 * Example: 1340 kgs + 200 gms = 1340.200 kgs
 */
export function calculateWeight(kgs: number | '', gms: number | ''): number {
  const k = typeof kgs === 'number' && kgs >= 0 ? kgs : 0;
  const g = typeof gms === 'number' && gms >= 0 ? gms : 0;
  const totalWeight = k + (g / 1000);
  return Math.round(totalWeight * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Calculates total amount for a single weighment row.
 * Amount = Weight (kg) * Rate
 * Example: 1340.200 kg * 153 = 205050.60
 */
export function calculateRowAmount(weight: number, rate: number | ''): number {
  const r = typeof rate === 'number' && rate >= 0 ? rate : 0;
  const totalAmount = weight * r;
  return Math.round(totalAmount * 100) / 100; // Round to 2 decimal places (paise)
}

/**
 * Splits a total amount into Rupees (Integer) and Paise (00-99).
 * Example: 205050.60 -> { rs: 205050, ps: 60 }
 */
export function splitRupeesAndPaise(amount: number): { rs: number; ps: number } {
  const roundedAmount = Math.round(amount * 100) / 100;
  const rs = Math.floor(roundedAmount);
  const ps = Math.round((roundedAmount - rs) * 100);
  return { rs, ps };
}

/**
 * Re-calculates all row metrics and overall totals for a given list of bill items.
 */
export function calculateBillTotals(items: BillItem[]) {
  let totalWeight = 0;
  let totalAmount = 0;

  const processedItems = items.map((item) => {
    const weight = calculateWeight(item.kgs, item.gms);
    const amount = calculateRowAmount(weight, item.rate);
    const { rs, ps } = splitRupeesAndPaise(amount);

    totalWeight += weight;
    totalAmount += amount;

    return {
      ...item,
      weight,
      amount,
      rs,
      ps
    };
  });

  totalWeight = Math.round(totalWeight * 1000) / 1000;
  totalAmount = Math.round(totalAmount * 100) / 100;
  const { rs: totalRs, ps: totalPs } = splitRupeesAndPaise(totalAmount);

  return {
    items: processedItems,
    totalWeight,
    totalAmount,
    totalRs,
    totalPs
  };
}

/**
 * Formats numbers into Indian Currency format (e.g. 205050 -> 2,05,050).
 */
export function formatIndianCurrency(amount: number): string {
  const { rs, ps } = splitRupeesAndPaise(amount);
  const formattedRs = rs.toLocaleString('en-IN');
  const formattedPs = ps < 10 ? `0${ps}` : `${ps}`;
  return `${formattedRs}.${formattedPs}`;
}

/**
 * Formats integer portion only with Indian commas (e.g. 205050 -> 2,05,050).
 */
export function formatIndianRupeesOnly(rs: number): string {
  return rs.toLocaleString('en-IN');
}
