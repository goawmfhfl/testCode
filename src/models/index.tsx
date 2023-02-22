import { CategoryNames } from "@constants/category";
import { OrderSearchType } from "@constants/sale";

export enum UploadFileType {
  PRODUCT_THUMBNAIL = "PRODUCT_THUMBNAIL",
  PRODUCT_REQUIRED = "PRODUCT_REQUIRED",
  PRODUCT_OPTIONAL = "PRODUCT_OPTIONAL",
  PRODUCT_DETAIL_PAGE = "PRODUCT_DETAIL_PAGE",
  SHOP_MOBILE = "SHOP_MOBILE",
  SHOP_PC = "SHOP_PC",
  SHOP_REGISTER_PDF = "SHOP_REGISTER_PDF",
  SHOP_REGISTER_ZIP = "SHOP_REGISTER_ZIP",
  PROMOTION_MAIN_IMAGE = "PROMOTION_MAIN_IMAGE",
  IDENTIFICATION_PHOTO_COPY = "IDENTIFICATION_PHOTO_COPY",
}

export enum TableType {
  SCROLL = "SCROLL",
  FIX = "FIX",
}

export enum CategoryType {
  NORMAL = "NORMAL",
  GIFT = "GIFT",
}

export interface CategoriesType {
  name: CategoryNames;
  type: CategoryType;

  parent?: Array<CategoriesType>;
  children?: Array<CategoriesType>;
}

export interface CommonFilterOptionType {
  page: number;
  skip: number;
  query: string;
  orderSearchType?: OrderSearchType;
}

export type QueryResponse<T> = T & {
  ok: boolean;
  error: string | null;
};
