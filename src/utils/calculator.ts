export function getDiscountedPrice(
  originalPrice: number,
  discountAmount: number,
  discountOption: string
): string {
  if (!discountAmount) {
    return "-";
  }

  if (discountOption === "PERCENT") {
    return String(originalPrice - originalPrice * discountAmount * 0.01);
  }

  if (discountOption === "WON") {
    return String(originalPrice - discountAmount);
  }

  return String(originalPrice);
}
