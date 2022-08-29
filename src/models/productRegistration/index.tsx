import { ShipmentChargeType } from "./shipmentTemplate";

enum CategoryName {
  HOMEDECO = "HOMEDECO",
  INCENSE_CANDLE = "INCENSE_CANDLE",
  POSTER = "POSTER",
  OBJET = "OBJET",
  VASE_FLOWERPOT = "VASE_FLOWERPOT",
  LIGHTING = "LIGHTING",
  MIRROR = "MIRROR",
  TRAY = "TRAY",
  MOBILE = "MOBILE",
  SOAP_DIFFUSER = "SOAP_DIFFUSER",
  TISSUE_COVER = "TISSUE_COVER",
  HOME_DIY = "HOME_DIY",
  FABRIC = "FABRIC",
  POSTER_BLANKET = "POSTER_BLANKET",
  CUSHION = "CUSHION",
  RUG_MAT = "RUG_MAT",
  BEDDING = "BEDDING",
  FABRIC_ETC = "FABRIC_ETC",
  TABLEWARE = "TABLEWARE",
  CUP = "CUP",
  PLATE = "PLATE",
  BOWL = "BOWL",
  FURNITURE = "FURNITURE",
  TECH = "TECH",
  MULTITAP_SOCKET = "MULTITAP_SOCKET",
  WATCH = "WATCH",
  DESKWARE = "DESKWARE",
  NOTE_MEMO = "NOTE_MEMO",
  STATIONERY = "STATIONERY",
  CARD_POSTCARD = "CARD_POSTCARD",
  WEAR_ACC = "WEAR_ACC",
  PHONE = "PHONE",
  ACCESSORIES = "ACCESSORIES",
  JEWELLERY = "JEWELLERY",
  BAG_POUCH = "BAG_POUCH",
  WEAR_ACC_ETC = "WEAR_ACC_ETC",
}

enum UploadedFileType {
  PRODUCT_THUMBNAIL = "PRODUCT_THUMBNAIL",
  PRODUCT_REQUIRED = "PRODUCT_REQUIRED",
  PRODUCT_OPTIONAL = "PRODUCT_OPTIONAL",
  SHOP_MOBILE = "SHOP_MOBILE",
  SHOP_PC = "SHOP_PC",
  SHOP_REGISTER_PDF = "SHOP_REGISTER_PDF",
  SHOP_REGISTER_ZIP = "SHOP_REGISTER_ZIP",
  PROMOTION_MAIN_IMAGE = "PROMOTION_MAIN_IMAGE",
}

export interface UploadedFileInfos {
  url: string;
  type: UploadedFileType;
}

enum Color {
  RED = "RED",
  ORANGE = "ORANGE",
  YELLOW = "YELLOW",
  YELLOW_GREEN = "YELLOW_GREEN",
  GREEN = "GREEN",
  SKY = "SKY",
  BLUE = "BLUE",
  NAVY = "NAVY",
  PINK = "PINK",
  VIOLET = "VIOLET",
  PURPLE = "PURPLE",
  BLACK = "BLACK",
  WHITE = "WHITE",
  GRAY = "GRAY",
  IVORY = "IVORY",
  BEIGE = "BEIGE",
  BROWN = "BROWN",
  PATTERN_ILLUST = "PATTERN_ILLUST",
}

interface ColorOptionInputType {
  name: Color;
}

interface OptionCombinationInputType {
  name: [{ name: string; value: string }];
  price: number;
  quantity: number;
  isRequired: boolean;
}

export interface CreateProductInputType {
  name: string;
  categoryName: CategoryName;
  uploadedFileInfos: [UploadedFileInfos];
  description: string;
  colors: [ColorOptionInputType];
  originalPrice: number;
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;
  discountAppliedPrice: number;
  quantity: number;
  optionCombinations: [OptionCombinationInputType];
  productionAfterOrder: string;
  shipmentId: number;
  isBundleShipment: boolean;
  shipmentType: ShipmentChargeType;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentConditionalPrice: number;
  shipmentReturnPrice: number;
  shipmentExchangePrice: number;
  specName: string;
  material: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;
  tagInfos: [
    {
      name: string;
      isExposed: boolean;
    }
  ];
  temporaryProductId: number;
  productId: number;
}
