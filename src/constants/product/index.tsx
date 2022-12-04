export enum RegistrationStatus {
  Initial = "Initial",
  TemporarilySaved = "TEMPORARILY_SAVED",
  Registered = "REGISTERED",
}

export const productType = {
  DEFAULT: "판매상태변경", // only client
  ON_SALE: "판매중",
  STOP_SALE: "숨김",
  SOLD_OUT: "품절",
  TEMPORARY: "임시저장",
};

export enum ProductStatus {
  DEFAULT = "DEFAULT", // only client
  ON_SALE = "ON_SALE",
  STOP_SALE = "STOP_SALE",
  SOLD_OUT = "SOLD_OUT",
  DELETED = "DELETED",
  TEMPORARY = "TEMPORARY",
}

export const productStatus = [
  { id: 0, label: productType.DEFAULT, value: ProductStatus.DEFAULT },
  { id: 0, label: productType.TEMPORARY, value: ProductStatus.TEMPORARY },
  { id: 1, label: productType.ON_SALE, value: ProductStatus.ON_SALE },
  { id: 2, label: productType.STOP_SALE, value: ProductStatus.STOP_SALE },
  { id: 3, label: productType.SOLD_OUT, value: ProductStatus.SOLD_OUT },
];
