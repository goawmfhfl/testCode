import { CategoryName } from "@models/productRegistration";

interface CategoryType {
  CATEGORY_FIRST: Array<string>;
  CATEGORY_SECOND: {
    HOMEDECO: Array<string>;
    FABRIC: Array<string>;
    TABLEWARE: Array<string>;
    FURNITURE: Array<string>;
    TECH: Array<string>;
    DESKWARE: Array<string>;
    WEAR_ACC: Array<string>;
  };
  CATEGORY_THIRD: {
    NATURE: Array<string>;
  };
}

export const CATEGORIES: CategoryType = {
  CATEGORY_FIRST: [
    CategoryName.HOMEDECO,
    CategoryName.FABRIC,
    CategoryName.TABLEWARE,
    CategoryName.FURNITURE,
    CategoryName.TECH,
    CategoryName.DESKWARE,
    CategoryName.WEAR_ACC,
  ],
  CATEGORY_SECOND: {
    HOMEDECO: [
      CategoryName.INCENSE_CANDLE,
      CategoryName.POSTER,
      CategoryName.OBJET,
      CategoryName.VASE_FLOWERPOT,
      CategoryName.LIGHTING,
      CategoryName.MIRROR,
      CategoryName.TRAY,
      CategoryName.MOBILE,
      CategoryName.SOAP_DIFFUSER,
      CategoryName.TISSUE_COVER,
      CategoryName.HOME_DIY,
    ],
    FABRIC: [
      CategoryName.POSTER_BLANKET,
      CategoryName.CUSHION,
      CategoryName.RUG_MAT,
      CategoryName.BEDDING,
      CategoryName.FABRIC_ETC,
    ],
    TABLEWARE: [CategoryName.CUP, CategoryName.PLATE, CategoryName.BOWL],
    FURNITURE: [],
    TECH: [CategoryName.MULTITAP_SOCKET, CategoryName.WATCH],
    DESKWARE: [
      CategoryName.NOTE_MEMO,
      CategoryName.STATIONERY,
      CategoryName.CARD_POSTCARD,
    ],
    WEAR_ACC: [
      CategoryName.PHONE,
      CategoryName.ACCESSORIES,
      CategoryName.JEWELLERY,
      CategoryName.BAG_POUCH,
      CategoryName.WEAR_ACC_ETC,
    ],
  },
  CATEGORY_THIRD: {
    NATURE: [CategoryName.NATURE],
  },
};

export const categoryMapper: { [key: string]: string } = {
  ALL: "전체",
  HOMEDECO: "HOMEDECO",
  INCENSE_CANDLE: "인센스/캔들",
  POSTER: "포스터",
  OBJET: "오브제",
  VASE_FLOWERPOT: "화병/화분",
  LIGHTING: "조명",
  MIRROR: "거울",
  TRAY: "트레이",
  MOBILE: "모빌",
  SOAP_DIFFUSER: "비누/디퓨저",
  TISSUE_COVER: "티슈커버",
  HOME_DIY: "홈 DIY",
  FABRIC: "FABRIC",
  POSTER_BLANKET: "포스터/블랭킷",
  CUSHION: "쿠션",
  RUG_MAT: "러그/매트",
  BEDDING: "침구",
  FABRIC_ETC: "FABRIC/기타",
  TABLEWARE: "TABLEWARE",
  CUP: "컵",
  PLATE: "접시/그릇",
  BOWL: "보울",
  FURNITURE: "FURNITURE",
  TECH: "TECH",
  MULTITAP_SOCKET: "멀티탭/콘센트",
  WATCH: "시계",
  DESKWARE: "DESKWARE",
  NOTE_MEMO: "노트/메모",
  STATIONERY: "문구",
  CARD_POSTCARD: "카드/엽서",
  WEAR_ACC: `WEAR&ACC`,
  PHONE: "폰",
  ACCESSORIES: "액세서리",
  JEWELLERY: "쥬얼리",
  BAG_POUCH: "가방/파우치",
  WEAR_ACC_ETC: "WEAR_ACC/기타",
};

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
  uploadedFileInfos: SHOP_SETTING_SECTIONS.SHOP_INFO,
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

  identificationCardOwner: SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER,
  identificationCardNumber: SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER,
  identificationCardIssueDate: SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER,

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
  uploadedFileInfos: PRODUCT_REGISTRATION_SECTIONS.PRODUCT_IMAGE,
  description: PRODUCT_REGISTRATION_SECTIONS.DESCRIPTION,
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
  Product = "/product",
  ProductRegistration = "/product/registration",
  Order = "/order",
  OrderCancel = "/order?claim=cancel",
  OrderReturn = "/order?claim=return",
  OrderExchange = "/order?claim=exchange",
  Inquiry = "/inquiry",
  Settlement = "/settlement",
  Shop = "/shop",
  Notice = "/notice",
}

export enum HeaderNames {
  Shop = "샵 설정",
  Product = "상품 관리",
  ProductRegistration = "상품 등록",
}
