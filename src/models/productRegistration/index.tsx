import { ImageType } from "@models/productImages";
import { ShipmentChargeType } from "./shipmentTemplate";

export enum CategoryName {
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
  NATURE = "NATURE",
}

export interface UploadedFileInfos {
  url: string;
  type: ImageType;
}

export enum ColorType {
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

export interface ColorInputType {
  name: string;
  hex: string;
  value: ColorType;
  darkCheckedIcon?: boolean;
}

export enum DiscountMethod {
  PERCENT = "PERCENT",
  WON = "WON",
}

export interface TemporarySaveProductInputType {
  name: string;
  categoryName: CategoryName;
  uploadedFileInfos: Array<UploadedFileInfos>;
  description: string;
  colors: Array<{
    name: ColorType;
  }>;
  originalPrice: number;
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;

  quantity: number;

  optionCombinations: Array<{
    components: Array<{ name: string; value: string }>;
    price: number;
    quantity: number;
    isRequired: boolean;
  }>;

  manufacturingLeadTime: {
    min: number;
    max: number;
  };

  shipmentId?: number;
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;

  specName: string;
  material: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;

  tagInfos: Array<{
    name: string;
    isExposed: boolean;
  }>;
}

export interface CreateProductInputType {
  name: string;
  categoryName: CategoryName;
  uploadedFileInfos: Array<UploadedFileInfos>;
  description: string;
  colors: Array<{
    name: ColorType;
  }>;
  originalPrice: number;
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;

  quantity: number;

  optionCombinations: Array<{
    components: Array<{ name: string; value: string }>;
    price: number;
    quantity: number;
    isRequired: boolean;
  }>;

  manufacturingLeadTime: {
    min: number;
    max: number;
  };

  shipmentId?: number;
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;

  specName: string;
  material: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;

  tagInfos: Array<{
    name: string;
    isExposed: boolean;
  }>;
}
