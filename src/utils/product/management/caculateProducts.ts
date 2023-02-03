import { CATEGORY_NAMES } from "@constants/category";
import { ProductsType } from "@graphql/queries/getProductsBySeller";
import { NormalizedType } from "@models/product/management";

import { getDiscountedPrice } from "@utils/calculator";

const caculateProducts = (recontructProducts: NormalizedType) => {
  const productsAllIds: Array<number> = recontructProducts?.products?.allIds;
  const productByids: { [key: number]: ProductsType } =
    recontructProducts?.products?.byId;

  const result = productsAllIds?.map((id) => {
    const {
      id: productId,
      name,
      category,
      originalPrice,
      discountAmount,
      discountMethod,
      status,
      thumbnail,
      quantity,
      options,
    } = productByids[id];

    const productName = name ? name : "-";
    const firstCategory = category?.parent?.name
      ? (CATEGORY_NAMES[category?.parent?.name] as string)
      : "-";

    const secondCategory = category?.name
      ? (CATEGORY_NAMES[category.name] as string)
      : "-";

    const thirdCategory = category?.children?.name
      ? (CATEGORY_NAMES[category.children.name] as string)
      : "-";

    const originalPriceToWonSign = originalPrice
      ? `${originalPrice.toLocaleString("ko-KR")} ₩`
      : "-";

    const discountedRate =
      discountMethod && discountAmount
        ? `${discountAmount.toLocaleString("ko-KR")} ${
            discountMethod === "PERCENT" ? "%" : "₩"
          }`
        : "-";

    const discountAppliedPrice =
      discountAmount && discountMethod
        ? Number(
            getDiscountedPrice(originalPrice, discountAmount, discountMethod)
          ).toLocaleString("ko-KR") + " ₩"
        : "";

    const resetQuantity = getQuantity(quantity, options);

    const finalSellngPrice = discountAppliedPrice
      ? discountAppliedPrice
      : originalPriceToWonSign;

    const isChecked = false;

    return {
      productId,
      thumbnail,
      productName,
      firstCategory,
      secondCategory,
      thirdCategory,
      originalPriceToWonSign,
      discountedRate,
      finalSellngPrice,
      quantity: resetQuantity,
      status,
      isChecked,
    };
  });

  return result;
};

const getQuantity = (
  quantity: number,
  options: Array<{ quantity: number; isRequired: boolean }>
) => {
  const hasQuantity = !!quantity;
  const hasOptions = !!options && !!options.length;

  if (!hasQuantity && !hasOptions) return 0;
  if (hasQuantity && !hasOptions) return quantity;
  if ((!hasQuantity && hasOptions) || (hasQuantity && hasOptions)) {
    return options.reduce((result, { quantity, isRequired }) => {
      if (isRequired) {
        result += quantity;
      }
      return result;
    }, 0);
  }
};

export default caculateProducts;
