export function getDiscountedPrice(
  originalPrice: number,
  discountAmount: number,
  discountOption: string
) {
  if (!discountAmount) {
    return "-";
  }

  if (discountOption === "PERCENT") {
    return originalPrice - originalPrice * discountAmount * 0.01;
  }

  if (discountOption === "WON") {
    return originalPrice - discountAmount;
  }

  return originalPrice;
}
