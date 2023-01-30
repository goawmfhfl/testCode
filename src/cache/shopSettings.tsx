import { makeVar } from "@apollo/client";
import { UnfulfilledStatus } from "@constants/index";

import {
  ShopImageVariables,
  SafetyCertificationVariables,
  BusinessLicenseVariables,
  SettlementAccountVariables,
} from "@models/shopSettings";

export const serversideShopImagesVar = makeVar<ShopImageVariables>({
  mobileImage: {
    url: "",
    file: null,
  },
  pcImage: {
    url: "",
    file: null,
  },
});

export const shopImagesVar = makeVar<ShopImageVariables>({
  mobileImage: {
    url: "",
    file: null,
  },
  pcImage: {
    url: "",
    file: null,
  },
});

export const SHOP_INTRODUCTION = "SHOP_INTRODUCTION";

export const SHIPMENT_POLICY = "SHIPMENT_POLICY";
export const RETURN_POLICY = "RETURN_POLICY";

export const safetyCertificationVar = makeVar<SafetyCertificationVariables>({
  isConfirmed: false,
  safetyAuthenticationNumber: "",
  safetyAuthenticationExpiredDate: null,
});

export const SHIPMENT_BUNDLING = "SHIPMENT_BUNDLING";
export const SHIPMENT_PRICE_TYPE = "SHIPMENT_PRICE_TYPE";
export const SHIPMENT_PRICE = "SHIPMENT_PRICE";
export const SHIPMENT_DISTANT_PRICE = "SHIPMENT_DISTANT_PRICE";
export const SHIPMENT_RETURN_PRICE = "SHIPMENT_RETURN_PRICE";
export const SHIPMENT_EXCHANGE_PRICE = "SHIPMENT_EXCHANGE_PRICE";
export const HAS_SET_CONDITIONAL_FREE_SHIPMENT =
  "HAS_SET_CONDITIONAL_FREE_SHIPMENT";
export const SHIPMENT_CONDITIONAL_PRICE = "SHIPMENT_CONDITIONAL_PRICE";

export const businessLicenseVar = makeVar<BusinessLicenseVariables>({
  isConfirmed: false,
  businessName: "",
  representativeName: "",
  businessRegistrationNumber: "",
  corporateRegistrationNumber: "",
  isSimpleTaxpayers: "",
  companyLocation: "",
  onlineSalesLicense: "",
});

export const REGISTRATION_NUMBER_PREFIX =
  "IDENTIFICATION.REGISTRATION_NUMBER.PREFIX";
export const REGISTRATION_NUMBER_SUFFIX =
  "IDENTIFICATION.REGISTRATION_NUMBER.SUFFIX";
export const PHOTOCOPY = "IDENTIFICATION.PHOTOCOPY";
export const serversideIdentificationPhotoCopy = makeVar<{
  url: string;
  file?: File;
}>({
  url: "",
  file: null,
});

export const phoneNumberVar = makeVar<string>("");

export const settlementAccountVar = makeVar<SettlementAccountVariables>({
  hasInformation: false,
  accountName: "",
  accountNumber: "",
  bankCode: "",
  bankName: "",
});

export const unfulfilledInputListVar = makeVar<
  Array<{
    name: string;
    status: UnfulfilledStatus | string;
  }>
>([]);
