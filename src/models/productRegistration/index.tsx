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
  // 상품명
  name: string;

  // 카테고리
  categoryName: CategoryName;

  // 대표사진
  uploadedFileInfos: Array<UploadedFileInfos>;

  // 상품설명
  description: string;

  // 상품컬러
  colors: Array<{
    name: ColorType;
  }>;

  // 판매가
  originalPrice: number;

  // 할인
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;
  discountAppliedPrice: number;

  // 재고
  quantity: number;

  // 옵션 (필수 + 선택)
  optionCombinations: Array<{
    components: Array<{ name: string; value: string }>;
    price: number;
    quantity: number;
    isRequired: boolean;
  }>;

  // 주문 후 제작 여부
  manufacturingLeadTime: {
    min: number;
    max: number;
  };

  // 배송 설정
  shipmentId?: number;
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;

  // 작품정보제공고시
  specName: string;
  material: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;

  // 검색용 태그 설정
  tagInfos: Array<{
    name: string;
    isExposed: boolean;
  }>;
}

export interface CreateProductInputType {
  // 상품명
  name: string;

  // 카테고리
  categoryName: CategoryName;

  // 대표사진
  uploadedFileInfos: Array<UploadedFileInfos>;

  // 상품설명
  description: string;

  // 상품컬러
  colors: Array<{
    name: ColorType;
  }>;

  // 판매가
  originalPrice: number;

  // 할인
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;
  discountAppliedPrice: number;

  // 재고
  quantity: number;

  // 옵션 (필수 + 선택)
  optionCombinations: Array<{
    name: Array<{ name: string; value: string }>;
    price: number;
    quantity: number;
    isRequired: boolean;
  }>;

  // 주문 후 제작 여부
  manufacturingLeadTime: {
    min: number;
    max: number;
  };

  // 배송 설정
  shipmentId?: number;
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;

  // 작품정보제공고시
  specName: string;
  material: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;

  // 검색용 태그 설정
  tagInfos: Array<{
    name: string;
    isExposed: boolean;
  }>;
}
