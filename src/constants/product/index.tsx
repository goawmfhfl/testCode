export enum ProductStatus {
  DEFAULT = "DEFAULT",
  ON_SALE = "ON_SALE",
  STOP_SALE = "STOP_SALE",
  SOLD_OUT = "SOLD_OUT",
  DELETED = "DELETED",
}

export const productType = {
  DEFAULT: "판매상태변경",
  ON_SALE: "판매중",
  STOP_SALE: "숨김",
  SOLD_OUT: "품절",
};

export const productStatus = [
  { id: 0, value: ProductStatus.DEFAULT, label: productType.DEFAULT },
  { id: 1, value: ProductStatus.ON_SALE, label: productType.ON_SALE },
  { id: 2, value: ProductStatus.STOP_SALE, label: productType.STOP_SALE },
  { id: 3, value: ProductStatus.SOLD_OUT, label: productType.SOLD_OUT },
];
