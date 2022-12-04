// 상품관리에서 사용하는 유틸리티를 작성

import { ProductStatus } from "@constants/product";

export const getProductLength = (
  productList: Array<{ status: ProductStatus }>
): Record<string, number> => {
  return productList.reduce(
    (result, { status }) => {
      if (status === ProductStatus.ON_SALE) result.onSale++;
      if (status === ProductStatus.STOP_SALE) result.stopSale++;
      if (status === ProductStatus.SOLD_OUT) result.soldOut++;
      if (status === ProductStatus.TEMPORARY) result.temporary++;

      return result;
    },
    {
      all: productList.length,
      onSale: 0,
      stopSale: 0,
      soldOut: 0,
      temporary: 0,
    }
  );
};
