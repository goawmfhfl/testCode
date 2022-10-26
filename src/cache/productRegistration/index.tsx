import { makeVar } from "@apollo/client";
import { ProductType } from "@models/productRegistration/index";

export const updatedProductRegistrationStatesVar = makeVar<ProductType>(null);

export const TITLE = "TITLE";

export const CATEGORY_FIRST = "CATEGORY_FIRST";
export const CATEGORY_SECOND = "CATEGORY_SECOND";
export const CATEGORY_THIRD = "CATEGORY_THIRD";

export const PRODUCT_DESCRIPTION = "PRODUCT_DESCRIPTION";

export const PRODUCT_COLOR = "PRODUCT_COLOR";

export const PRODUCT_PRICE = "PRODUCT_PRICE";

export const IS_DISCOUNTED = "IS_DISCOUNTED"; // client only
export const DISCOUNT_AMOUNT = "DISCOUNT_AMOUNT";
export const DISCOUNT_OPTION = "DISCOUNT_OPTION";
export const HAS_DISCOUNT_SPAN = "HAS_DISCOUNT_SPAN"; // client only
export const DISCOUNT_STARTS_AT = "DISCOUNT_STARTS_AT";
export const DISCOUNT_ENDS_AT = "DISCOUNT_ENDS_AT";

export const PRODUCT_STOCK = "PRODUCT_STOCK";

export const HAS_REQUIRED_OPTION = "HAS_REQUIRED_OPTION";
export const HAS_SELECTIVE_OPTION = "HAS_SELECTIVE_OPTION";

export const HAS_MANUFACTURING_LEAD_TIME = "HAS_MANUFACTURING_LEAD_TIME";
export const LEAD_TIME_MIN = "LEAD_TIME_MIN";
export const LEAD_TIME_MAX = "LEAD_TIME_MAX";

export const SHIPMENT_TEMPLATE = "SHIPMENT_TEMPLATE";
export const IS_BUNDLE_SHIPMENT = "IS_BUNDLE_SHIPMENT";
export const SHIPMENT_PRICE_TYPE = "SHIPMENT_PRICE_TYPE";
export const SHIPMENT_PRICE = "SHIPMENT_PRICE";
export const SHIPMENT_DISTANT_PRICE = "SHIPMENT_DISTANT_PRICE";
export const RETURN_PRICE = "RETURN_PRICE";
export const EXCHANGE_PRICE = "EXCHANGE_PRICE";

export const SPEC_NAME = "SPEC_NAME";
export const MATERIAL = "MATERIAL";
export const SIZE = "SIZE";
export const WEIGHT = "WEIGHT";
export const MANUFACTURER = "MANUFACTURER";
export const PRECAUTION = "PRECAUTION";
export const AUTHORIZATION = "AUTHORIZATION";
export const PERSON_IN_CHARGE = "PERSON_IN_CHARGE";

export const HAS_TAG_INFOS = "HAS_TAG_INFOS";
