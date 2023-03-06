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
      startDiscountDate,
      endDiscountDate,
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

    const discountedRate = getDiscountedRate(
      startDiscountDate,
      endDiscountDate,
      discountMethod,
      discountAmount
    );

    const discountAppliedPrice =
      discountedRate !== "-"
        ? Number(
            getDiscountedPrice(originalPrice, discountAmount, discountMethod)
          ).toLocaleString() + " ₩"
        : null;

    const resetQuantity = getQuantity(
      quantity,
      options.filter((option) => option.isRequired)
    );

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
      finalSellngPrice: discountAppliedPrice ?? originalPriceToWonSign,
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

  if (hasOptions) {
    return options.reduce((result, { quantity }) => {
      return (result += quantity);
    }, 0);
  }

  if (hasQuantity) {
    return quantity;
  }
};

const getDiscountedRate = (
  startDiscountDate: string,
  endDiscountDate: string,
  discountMethod: string,
  discountAmount: number
) => {
  const hasDiscount = !!discountMethod && !!discountAmount;
  if (!hasDiscount) return "-";

  const isSetDiscountSpan =
    Boolean(startDiscountDate) || Boolean(endDiscountDate);

  const isDiscountNow =
    new Date(startDiscountDate).getTime() <= new Date().getTime() &&
    new Date().getTime() <= new Date(endDiscountDate).getTime();

  if (isSetDiscountSpan) {
    if (isDiscountNow) {
      return `${discountAmount.toLocaleString("ko-KR")} ${
        discountMethod === "PERCENT" ? "%" : "₩"
      }`;
    }

    if (!isDiscountNow) {
      return "-";
    }
  }

  if (!isSetDiscountSpan) {
    return `${discountAmount.toLocaleString("ko-KR")} ${
      discountMethod === "PERCENT" ? "%" : "₩"
    }`;
  }
};

export default caculateProducts;
