import { ProductStatus } from "@constants/product";
import {
  OrderStatusGroup,
  OrderStatusType,
  OrderStatusName,
} from "@constants/sale";
import { SkipQuantityType } from "@models/sale";

export const skipQuantityType: Array<SkipQuantityType> = [
  { id: 0, label: "20개씩 보기", value: 20 },
  { id: 1, label: "50개씩 보기", value: 50 },
  { id: 2, label: "100개씩 보기", value: 100 },
];

export enum SHOP_SETTING_SECTIONS {
  SHOP_INFO = "SHOP_INFO",
  SHOP_POLICY = "SHOP_POLICY",
  SAFETY_CERTIFICATION = "SAFETY_CERTIFICATION",
  SHIPMENT_SETTINGS = "SHIPMENT_SETTINGS",
  BUSINESS_LICENSE = "BUSINESS_LICENSE",
  REGISTRATION_NUMBER = "REGISTRATION_NUMBER",
  PHONE_NUMBER = "PHONE_NUMBER",
  SETTLEMENT_ACCOUNT = "SETTLEMENT_ACCOUNT",
}

export const shopSettingsSectionMapper: { [key: string]: string } = {
  shopInfo: SHOP_SETTING_SECTIONS.SHOP_INFO,
  description: SHOP_SETTING_SECTIONS.SHOP_INFO,
  shipmentPolicy: SHOP_SETTING_SECTIONS.SHOP_POLICY,
  returnPolicy: SHOP_SETTING_SECTIONS.SHOP_POLICY,

  safetyAuthentication: SHOP_SETTING_SECTIONS.SAFETY_CERTIFICATION,
  safetyAuthenticationExpiredDate: SHOP_SETTING_SECTIONS.SAFETY_CERTIFICATION,

  shipmentType: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  shipmentPrice: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  shipmentDistantPrice: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  shipmentConditionalPrice: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  shipmentReturnPrice: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  shipmentExchangePrice: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,
  isBundleShipment: SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS,

  representativeName: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,
  businessRegistrationNumber: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,
  corporateRegistrationNumber: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,
  isSimpleTaxpayers: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,
  companyLocation: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,
  onlineSalesLicense: SHOP_SETTING_SECTIONS.BUSINESS_LICENSE,

  identificationCardNumber: SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER,
  identificationCardCopyPhoto: SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER,

  phoneNumber: SHOP_SETTING_SECTIONS.PHONE_NUMBER,

  bankAccountNumber: SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT,
  bankAccountHolder: SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT,
  bankName: SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT,
};

export enum PRODUCT_REGISTRATION_SECTIONS {
  PRODUCT_NAME = "PRODUCT_NAME",
  CATEGORY = "CATEGORY",
  PRODUCT_IMAGE = "PRODUCT_IMAGE",
  DESCRIPTION = "DESCRIPTION",
  DESCRIPTION_IMAGE = "DESCRIPTION_IMAGE",
  COLOR = "COLOR",
  PRICE = "PRICE",
  DISCOUNT = "DISCOUNT",
  STOCK = "STOCK",
  REQUIRED_OPTION = "REQUIRED_OPTION",
  SELECTIVE_OPTION = "SELECTIVE_OPTION",
  ORDER_PRODUCTION = "ORDER_PRODUCTION",
  SHIPMENT_SETTINGS = "SHIPMENT_SETTINGS",
  SPECIFICATION = "SPECIFICATION",
  SEARCH_TAG = "SEARCH_TAG",
}

export const productRegistrationSectionMapper: { [key: string]: string } = {
  name: PRODUCT_REGISTRATION_SECTIONS.PRODUCT_NAME,
  categoryName: PRODUCT_REGISTRATION_SECTIONS.CATEGORY,
  requiredImages: PRODUCT_REGISTRATION_SECTIONS.PRODUCT_IMAGE,
  description: PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION,
  descriptionImages: PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION_IMAGE,
  colors: PRODUCT_REGISTRATION_SECTIONS.COLOR,
  originalPrice: PRODUCT_REGISTRATION_SECTIONS.PRICE,
  discountAmount: PRODUCT_REGISTRATION_SECTIONS.DISCOUNT,
  discountMethod: PRODUCT_REGISTRATION_SECTIONS.DISCOUNT,
  startDiscountDate: PRODUCT_REGISTRATION_SECTIONS.DISCOUNT,
  endDiscountDate: PRODUCT_REGISTRATION_SECTIONS.DISCOUNT,
  quantity: PRODUCT_REGISTRATION_SECTIONS.STOCK,
  requiredOptions: PRODUCT_REGISTRATION_SECTIONS.REQUIRED_OPTION,
  selectiveOptions: PRODUCT_REGISTRATION_SECTIONS.SELECTIVE_OPTION,
  manufacturingLeadTime: PRODUCT_REGISTRATION_SECTIONS.ORDER_PRODUCTION,
  isBundleShipment: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  shipmentType: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  shipmentPrice: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  shipmentDistantPrice: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  shipmentReturnPrice: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  shipmentExchangePrice: PRODUCT_REGISTRATION_SECTIONS.SHIPMENT_SETTINGS,
  specName: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  material: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  weight: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  size: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  manufacturer: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  precaution: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  authorization: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  personInCharge: PRODUCT_REGISTRATION_SECTIONS.SPECIFICATION,
  tagInfos: PRODUCT_REGISTRATION_SECTIONS.SEARCH_TAG,
};

export const encryptProductStatusId = {
  [ProductStatus.ON_SALE]: "0",
  [ProductStatus.STOP_SALE]: "1",
  [ProductStatus.SOLD_OUT]: "2",
  [ProductStatus.TEMPORARY]: "3",
};

export const decryptProductStatusId = {
  "0": ProductStatus.ON_SALE,
  "1": ProductStatus.STOP_SALE,
  "2": ProductStatus.SOLD_OUT,
  "3": ProductStatus.TEMPORARY,
};

export const encryptSaleStatusId = {
  [OrderStatusGroup.ORDER]: "0",
  [OrderStatusGroup.CANCEL]: "1",
  [OrderStatusGroup.REFUND]: "2",
  [OrderStatusGroup.EXCHANGE]: "3",
};

export const decryptSaleStatusId = {
  "0": OrderStatusGroup.ORDER,
  "1": OrderStatusGroup.CANCEL,
  "2": OrderStatusGroup.REFUND,
  "3": OrderStatusGroup.EXCHANGE,
};

export const encryptSaleTypeId = {
  [OrderStatusType.ORDER]: "0",
  [OrderStatusType.CLAIM]: "1",
};

export const decryptSaleTypeId = {
  "0": OrderStatusType.ORDER,
  "1": OrderStatusType.CLAIM,
};

export const encryptSaleNameId = {
  [OrderStatusName.PAYMENT_COMPLETED]: "0",
  [OrderStatusName.PREPARING]: "1",
  [OrderStatusName.SHIPPING]: "2",
  [OrderStatusName.SHIPPING_COMPLETED]: "3",
  [OrderStatusName.CANCEL_REQUEST]: "4",
  [OrderStatusName.CANCEL_COMPLETED]: "5",
  [OrderStatusName.REFUND_REQUEST]: "6",
  [OrderStatusName.REFUND_PICK_UP_IN_PROGRESS]: "7",
  [OrderStatusName.REFUND_PICK_UP_COMPLETED]: "8",
  [OrderStatusName.REFUND_COMPLETED]: "9",
  [OrderStatusName.EXCHANGE_REQUEST]: "10",
  [OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS]: "11",
  [OrderStatusName.EXCHANGE_PICK_UP_COMPLETED]: "12",
  [OrderStatusName.SHIPPING_AGAIN]: "13",
  [OrderStatusName.EXCHANGE_COMPLETED]: "14",
};

export const decryptSaleNameId = {
  "0": OrderStatusName.PAYMENT_COMPLETED,
  "1": OrderStatusName.PREPARING,
  "2": OrderStatusName.SHIPPING,
  "3": OrderStatusName.SHIPPING_COMPLETED,
  "4": OrderStatusName.CANCEL_REQUEST,
  "5": OrderStatusName.CANCEL_COMPLETED,
  "6": OrderStatusName.REFUND_REQUEST,
  "7": OrderStatusName.REFUND_PICK_UP_IN_PROGRESS,
  "8": OrderStatusName.REFUND_PICK_UP_COMPLETED,
  "9": OrderStatusName.REFUND_COMPLETED,
  "10": OrderStatusName.EXCHANGE_REQUEST,
  "11": OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS,
  "12": OrderStatusName.EXCHANGE_PICK_UP_COMPLETED,
  "13": OrderStatusName.SHIPPING_AGAIN,
  "14": OrderStatusName.EXCHANGE_COMPLETED,
};

export const Pathnames = {
  Home: "/",
  Login: "/login",
  Password: "/password",
  Product: "/product",
  ProductOnsale: `/product?statusId=${encryptProductStatusId.ON_SALE}`,
  ProductStopSale: `/product?statusId=${encryptProductStatusId.STOP_SALE}`,
  ProductSoldOut: `/product?statusId=${encryptProductStatusId.SOLD_OUT}`,
  ProductTemporary: `/product?statusId=${encryptProductStatusId.TEMPORARY}`,
  ProductRegistration: `/product/registration`,

  Sale: "/sale",

  Order: `/sale?statusId=${encryptSaleStatusId.ORDER}`,
  OrderPaymentCompleted: `/sale?statusId=${encryptSaleStatusId.ORDER}&typeId=${encryptSaleTypeId.ORDER}&nameId=${encryptSaleNameId.PAYMENT_COMPLETED}`,
  OrderPreparing: `/sale?statusId=${encryptSaleStatusId.ORDER}&typeId=${encryptSaleTypeId.ORDER}&nameId=${encryptSaleNameId.PREPARING}`,
  OrderShipping: `/sale?statusId=${encryptSaleStatusId.ORDER}&typeId=${encryptSaleTypeId.ORDER}&nameId=${encryptSaleNameId.SHIPPING}`,
  OrderShippingCompleted: `/sale?statusId=${encryptSaleStatusId.ORDER}&typeId=${encryptSaleTypeId.ORDER}&nameId=${encryptSaleNameId.SHIPPING_COMPLETED}`,

  Cancel: `/sale?statusId=${encryptSaleStatusId.CANCEL}`,
  CancelReqeust: `/sale?statusId=${encryptSaleStatusId.CANCEL}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.CANCEL_REQUEST}`,
  CancelCompleted: `/sale?statusId=${encryptSaleStatusId.CANCEL}&typeId=${encryptSaleTypeId.ORDER}&nameId=${encryptSaleNameId.CANCEL_COMPLETED}`,

  Refund: `/sale?statusId=${encryptSaleStatusId.REFUND}`,
  RefundRequest: `/sale?statusId=${encryptSaleStatusId.REFUND}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.REFUND_REQUEST}`,
  RefundPickupInProgress: `/sale?statusId=${encryptSaleStatusId.REFUND}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.REFUND_PICK_UP_IN_PROGRESS}`,
  RefundPickupCompleted: `/sale?statusId=${encryptSaleStatusId.REFUND}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.REFUND_PICK_UP_COMPLETED}`,
  RefundCompleted: `/sale?statusId=${encryptSaleStatusId.REFUND}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.REFUND_COMPLETED}`,

  Exchange: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}`,
  ExchangeRequest: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.EXCHANGE_REQUEST}`,
  ExchangePickupInProgress: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.EXCHANGE_PICK_UP_IN_PROGRESS}`,
  ExchangePickupCompleted: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.EXCHANGE_PICK_UP_COMPLETED}`,
  ExchangeShippingAgain: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.SHIPPING_AGAIN}`,
  ExchangeCompleted: `/sale?statusId=${encryptSaleStatusId.EXCHANGE}&typeId=${encryptSaleTypeId.CLAIM}&nameId=${encryptSaleNameId.EXCHANGE_COMPLETED}`,

  Inquiry: "/inquiry",
  Settlement: "/settlement",
  Shop: "/shop",
  Notice: "/notice",
  Error: "/error",
};

export enum ServiceUrls {
  Consumer = "https://www.chopsticks.market",
}

export enum HeaderNames {
  Order = "주문관리",
  Cancel = "취소관리",
  Refund = "반품관리",
  Exchange = "교환관리",
  Shop = "샵 설정",
  Product = "상품 관리",
  ProductRegistration = "상품 등록",
}

export enum SubmissionType {
  Create = "CREATE",
  Update = "UPDATE",
}

export enum UnfulfilledStatus {
  Unfilled = "필수 입력사항입니다.",
  Fulfilled = "",
}
