export enum UploadFileType {
  PRODUCT_THUMBNAIL = "PRODUCT_THUMBNAIL",
  PRODUCT_REQUIRED = "PRODUCT_REQUIRED",
  PRODUCT_OPTIONAL = "PRODUCT_OPTIONAL",
  SHOP_MOBILE = "SHOP_MOBILE",
  SHOP_PC = "SHOP_PC",
  SHOP_REGISTER_PDF = "SHOP_REGISTER_PDF",
  SHOP_REGISTER_ZIP = "SHOP_REGISTER_ZIP",
  PROMOTION_MAIN_IMAGE = "PROMOTION_MAIN_IMAGE",
}

export enum TableType {
  SCROLL = "SCROLL",
  FIX = "FIX",
}

export enum CategoryName {
  HOMEDECO = "HOMEDECO",
  INCENSE = "INCENSE",
  CANDLE = "CANDLE",
  DIFFUSER_ROOMSPRAY = "DIFFUSER_ROOMSPRAY",
  OBJET = "OBJET",
  BASKET_TRAY = "BASKET_TRAY",
  CASE_BOX = "CASE_BOX",
  POSTER_FRAME = "POSTER_FRAME",
  HANGING_MOBILE = "HANGING_MOBILE",
  LIGHTING = "LIGHTING",
  MIRROR = "MIRROR",
  WATCH = "WATCH",
  HOMEFABRIC = "HOMEFABRIC",
  BEDDING = "BEDDING",
  BLANKET = "BLANKET",
  FABRIC_POSTER = "FABRIC_POSTER",
  CUSHION = "CUSHION",
  RUG_MAT = "RUG_MAT",
  TISSUE_COVER = "TISSUE_COVER",
  HOMEWARE_SLIPPERS = "HOMEWARE_SLIPPERS",
  FABRIC_ETC = "FABRIC_ETC",
  HOMELIVING = "HOMELIVING",
  FURNITURE = "FURNITURE",
  BATHROOM = "BATHROOM",
  VASE_FLOWERPOT = "VASE_FLOWERPOT",
  PET = "PET",
  DIY = "DIY",
  TABLEWARE = "TABLEWARE",
  MUGCUP = "MUGCUP",
  GLASSCUP = "GLASSCUP",
  COFFEECUP_TEACUP = "COFFEECUP_TEACUP",
  BOWL = "BOWL",
  PLATE = "PLATE",
  CUTLERY = "CUTLERY",
  TEA_WEAR = "TEA_WEAR",
  KITCHEN_SET = "KITCHEN_SET",
  KITCHEN_ETC = "KITCHEN_ETC",
  DIGITAL_ACC = "DIGITAL_ACC",
  PHONE_CASE = "PHONE_CASE",
  GRIPTOK = "GRIPTOK",
  EARPHONE_CASE = "EARPHONE_CASE",
  KEYRING = "KEYRING",
  STRAP = "STRAP",
  MOUSEPAD = "MOUSEPAD",
  MULTITAP_SOCKET = "MULTITAP_SOCKET",
  WEARABLE = "WEARABLE",
  BAG = "BAG",
  POUCH = "POUCH",
  CAP_HAIR = "CAP_HAIR",
  ACCESSORIES = "ACCESSORIES",
  FASHION_ACCESSORIES = "FASHION_ACCESSORIES",
  STATIONERY = "STATIONERY",
  NOTE_MEMO = "NOTE_MEMO",
  STICKER_TAPE = "STICKER_TAPE",
  CARD_POSTCARD_LETTER = "CARD_POSTCARD_LETTER",
  WRITING_MATERIAL = "WRITING_MATERIAL",
  FILE_STAND = "FILE_STAND",
  STATIONERY_ACC = "STATIONERY_ACC",
  CALENDER = "CALENDER",
  COMING_OF_AGE_DAY = "COMING_OF_AGE_DAY",
  BE_GOOD_TO_PARENTS = "BE_GOOD_TO_PARENTS",
  HAPPY_BIRTHDAY = "HAPPY_BIRTHDAY",
  HOUSEWARMING = "HOUSEWARMING",
  CONTRATULATIONS_TO_NEW_BUSINESS = "CONTRATULATIONS_TO_NEW_BUSINESS",
}

export enum CategoryType {
  NORMAL = "NORMAL",
  GIFT = "GIFT",
}

export interface CategoriesType {
  name: CategoryName;
  type: CategoryType;

  parent?: Array<{
    name: CategoryName;
    type: CategoryType;
  }>;

  children?: Array<{
    name: CategoryName;
    type: CategoryType;
  }>;
}

export interface CommonFilterOptionType {
  page: number;
  skip: number;
  query: string;
}
