/**
 * Formats a number as Indian Rupee (INR) using the Indian numbering system.
 * Example: 100000 -> ₹1,00,000
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculates GST (Goods and Services Tax) for a given amount.
 * Default GST rate in India for advertising services is typically 18%.
 */
export const calculateGST = (amount: number, rate: number = 0.18) => {
  const gstAmount = amount * rate;
  return {
    baseAmount: amount,
    gstAmount,
    totalAmount: amount + gstAmount,
    ratePercent: rate * 100,
  };
};

/**
 * Formats a number with Indian comma placement without the currency symbol.
 * Example: 100000 -> 1,00,000
 */
export const formatIndianNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Gets the current Indian Financial Year string.
 * Example: "FY 2024-25"
 */
export const getIndianFinancialYear = (): string => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed, so 3 is April
  const currentYear = now.getFullYear();
  
  if (currentMonth >= 3) { // April or later
    return `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  } else {
    return `FY ${currentYear - 1}-${currentYear.toString().slice(-2)}`;
  }
};
