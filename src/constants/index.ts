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

export enum Pathnames {
  Home = "/",
  Login = "/login",
  Password = "/password",
  Product = "/product",
  ProductRegistration = "/product/registration",
  Order = "/order",
  // OrderCancel = "/order?claim=cancel",
  // OrderReturn = "/order?claim=return",
  // OrderExchange = "/order?claim=exchange",
  Inquiry = "/inquiry",
  Settlement = "/settlement",
  Shop = "/shop",
  Notice = "/notice",
  Error = "/error",
}

export enum HeaderNames {
  Order = "주문관리",
  Cancel = "취소관리",
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
