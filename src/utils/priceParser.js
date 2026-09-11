/**
 * Parse flexible price string into a numeric value
 * Handles formats like:
 * - "45000" -> 45000
 * - "₹45,000" -> 45000
 * - "45,000" -> 45000
 * - "45k" / "45K" -> 45000
 * - "1.5L" -> 150000
 * - "Rs. 25,500 /-" -> 25500
 */
export function parseSellPrice(input) {
  if (typeof input === 'number') {
    return isNaN(input) ? 0 : input;
  }
  if (!input || typeof input !== 'string') {
    return 0;
  }

  const str = input.trim().toLowerCase();

  // Match 'k' multiplier (e.g. 45k, 45.5k)
  const kMatch = str.match(/^([\d.,]+)\s*k$/);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  // Match 'l' or 'lakh' or 'lac' multiplier (e.g. 1.2 lakh, 1.2L)
  const lakhMatch = str.match(/^([\d.,]+)\s*(?:l|lakh|lac)s?$/);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) return Math.round(num * 100000);
  }

  // Strip non-numeric characters except decimal point
  const clean = str.replace(/[^\d.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseSellPrice(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}
