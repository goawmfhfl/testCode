import { CategoryNames } from "@constants/category";
import { ProductStatus } from "@constants/product";
import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";

export interface UploadedFileInfos {
  url: string;
  type: UploadFileType;
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
  productId: null | number;
  name: string;
  categoryName: CategoryNames;
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
  weight: string;
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
  categoryName: CategoryNames;
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
  weight: string;
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

export interface OptionCombination {
  components: Array<{ name: string; value: string }>;
  price: number;
  quantity: number;
  isRequired: boolean;
}

export interface ProductType {
  name: string;
  description: string;
  colors: Array<{
    name: ColorType;
  }>;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;

  originalPrice: number;
  discountAmount: number;
  discountMethod: string;
  startDiscountDate: Date;
  endDiscountDate: Date;
  quantity: number;

  options: Array<OptionCombination>;

  manufacturingLeadTime: {
    min: number;
    max: number;
  };

  shipment: {
    id: number;
  };
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;

  specName: string;
  material: string;
  weight: string;
  size: string;
  manufacturer: string;
  precaution: string;
  authorization: string;
  personInCharge: string;

  category: ProductCategory;

  productToTags?: Array<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isExposed: boolean;
    tag: Array<{ id: number; name: string }>;
  }>;

  uploadedFileUrls: Array<{
    id: number;
    url: string;
    type: UploadFileType;
  }>;
}

export interface ProductCategory {
  name: string;
  parent: ProductCategory;
  children: Array<ProductCategory>;
}

export interface ProductFormValues {
  TITLE: string;
  CATEGORY_FIRST: string;
  CATEGORY_SECOND: string;
  CATEGORY_THIRD: string;
  PRODUCT_DESCRIPTION: string;
  PRODUCT_COLOR: Array<string>;
  PRODUCT_PRICE: number;
  IS_DISCOUNTED: boolean;
  DISCOUNT_AMOUNT: number;
  DISCOUNT_OPTION: string;
  DISCOUNT_STARTS_AT: Date;
  DISCOUNT_ENDS_AT: Date;
  HAS_DISCOUNT_SPAN: boolean;
  PRODUCT_STOCK: number;
  HAS_REQUIRED_OPTION: boolean;
  HAS_MANUFACTURING_LEAD_TIME: boolean;
  LEAD_TIME_MAX: number;
  LEAD_TIME_MIN: number;
  IS_BUNDLE_SHIPMENT: string;
  SHIPMENT_TEMPLATE_ID: number;
  SHIPMENT_TEMPLATE_NAME: string;
  SHIPMENT_PRICE_TYPE: ShipmentChargeType;
  SHIPMENT_PRICE: number;
  SHIPMENT_DISTANT_PRICE: number;
  SHIPMENT_RETURN_PRICE: number;
  SHIPMENT_EXCHANGE_PRICE: number;
  SPEC_NAME: string;
  MATERIAL: string;
  SIZE: string;
  WEIGHT: string;
  MANUFACTURER: string;
  PRECAUTION: string;
  AUTHORIZATION: string;
  PERSON_IN_CHARGE: string;
  HAS_TAG_INFOS: boolean;
  [key: string]: unknown; // hmm..
}
