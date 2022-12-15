export function getDiscountedPrice(
  originalPrice: number,
  discountAmount: number,
  discountOption: string
) {
  let discountedPrice: number = originalPrice;

  if (discountOption === "PERCENT") {
    discountedPrice = originalPrice - originalPrice * discountAmount * 0.01;
  }

  if (discountOption === "WON") {
    discountedPrice = originalPrice - discountAmount;
  }

  if (discountedPrice < 0) {
    return 0;
  }

  return discountedPrice;
}

export function getAverageWidth(
  columnWidth: number,
  tableWidth: number
): number {
  const result = Number(String((columnWidth / tableWidth) * 100).slice(0, 5));

  return result;
}
