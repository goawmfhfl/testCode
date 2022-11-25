export interface ProductImageType {
  id: string;
  url: string | undefined;
  type: UploadedFileType;
}

export enum UploadedFileType {
  PRODUCT_THUMBNAIL = "PRODUCT_THUMBNAIL",
  PRODUCT_REQUIRED = "PRODUCT_REQUIRED",
  PRODUCT_OPTIONAL = "PRODUCT_OPTIONAL",
  SHOP_MOBILE = "SHOP_MOBILE",
  SHOP_PC = "SHOP_PC",
  SHOP_REGISTER_PDF = "SHOP_REGISTER_PDF",
  SHOP_REGISTER_ZIP = "SHOP_REGISTER_ZIP",
}
