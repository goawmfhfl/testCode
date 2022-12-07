import { ProductsType } from "@graphql/queries/getAllProductsBySeller";
import { NormalizedType } from "@models/product/management";

import { getDiscountedPrice } from "@utils/calculator";

export const caculateProducts = (recontructProducts: NormalizedType) => {
  const productsAllIds: Array<number> = recontructProducts?.products?.allIds;
  const productByids: { [key: number]: ProductsType } =
    recontructProducts?.products?.byId;

  const result = productsAllIds?.map((id) => {
    const {
      // 상품 번호
      id: productId,
      name,
      category,
      originalPrice,
      discountAmount,
      discountMethod,
      status,
      thumbnail,
      quantity,
    } = productByids[id];

    // 상품명
    const productName = name ? name : "-";
    // 대분류
    const firstCategory = category?.parent?.name ? category?.parent?.name : "-";
    // 중분류
    const secondCategory = category?.name ? category.name : "-";
    // 소분류
    const thirdCategory = category?.children?.name
      ? category.children.name
      : "-";
    // 판매가
    const originalPriceToWonSign = `${originalPrice.toLocaleString("ko-KR")} ₩`;
    // 할인율
    const discountedRate =
      discountMethod && discountAmount
        ? `${discountAmount.toLocaleString("ko-KR")} ${
            discountMethod === "PERCENT" ? "%" : "₩"
          }`
        : "-";
    // 최종가
    const discountAppliedPrice =
      discountAmount && discountMethod
        ? Number(
            getDiscountedPrice(originalPrice, discountAmount, discountMethod)
          ).toLocaleString("ko-KR") + " ₩"
        : "-";

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
      discountAppliedPrice,
      quantity,
      status,
      isChecked,
    };
  });

  return result;
};
