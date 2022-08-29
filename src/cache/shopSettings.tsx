import { makeVar } from "@apollo/client";

import {
  ShopImageVariables,
  SafetyCertificationVariables,
  BusinessLicenseVariables,
  SettlementAccountVariables,
  RegistrationVariables,
} from "@models/shopSettings";

export const shopImagesVar = makeVar<ShopImageVariables>({
  mobileImage: "",
  pcImage: "",
});

export const SHOP_INTRODUCTION = "SHIP_INTRODUCTION";

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
export const SHIPMENT_CONDITIONAL_PRICE = "SHIPMENT_CONDITIONAL_PRICE";

export const businessLicenseVar = makeVar<BusinessLicenseVariables>({
  isConfirmed: false,
  representativeName: "",
  businessRegistrationNumber: "",
  corporateRegistrationNumber: "",
  isSimpleTaxpayers: "",
  companyLocation: "",
  onlineSalesLicense: "",
});

export const registrationNumberVar = makeVar<RegistrationVariables>({
  isConfirmed: false,
  identificationCardOwner: "",
  identificationCardNumber: "",
  identificationCardIssueDate: new Date(),
});

export const phoneNumberVar = makeVar<string>("");

export const settlementAccountVar = makeVar<SettlementAccountVariables>({
  hasInformation: false,
  accountName: "",
  accountNumber: "",
  bankCode: "",
  bankName: "",
});

export enum SECTIONS {
  SHOP_INFO = "SHOP_INFO",
  SHOP_POLICY = "SHOP_POLICY",
  SAFETY_CERTIFICATION = "SAFETY_CERTIFICATION",
  SHIPMENT_SETTINGS = "SHIPMENT_SETTINGS",
  BUSINESS_LICENSE = "BUSINESS_LICENSE",
  REGISTRATION_NUMBER = "REGISTRATION_NUMBER",
  PHONE_NUMBER = "PHONE_NUMBER",
  SETTLEMENT_ACCOUNT = "SETTLEMENT_ACCOUNT",
}

export const sectionFulfillmentVar = makeVar<{ [key: string]: boolean }>({
  SHOP_INFO: true,
  SHOP_POLICY: true,
  SAFETY_CERTIFICATION: true,
  SHIPMENT_SETTINGS: true,
  BUSINESS_LICENSE: true,
  REGISTRATION_NUMBER: true,
  PHONE_NUMBER: true,
  SETTLEMENT_ACCOUNT: true,
});

// 인풋들을 섹션으로 매핑
export const sectionMapperVar = makeVar<{ [key: string]: string }>({
  uploadedFileInfos: SECTIONS.SHOP_INFO,
  description: SECTIONS.SHOP_INFO,
  shipmentPolicy: SECTIONS.SHOP_POLICY,
  returnPolicy: SECTIONS.SHOP_POLICY,

  safetyAuthentication: SECTIONS.SAFETY_CERTIFICATION,
  safetyAuthenticationExpiredDate: SECTIONS.SAFETY_CERTIFICATION,

  shipmentType: SECTIONS.SHIPMENT_SETTINGS,
  shipmentPrice: SECTIONS.SHIPMENT_SETTINGS,
  shipmentDistantPrice: SECTIONS.SHIPMENT_SETTINGS,
  shipmentConditionalPrice: SECTIONS.SHIPMENT_SETTINGS,
  shipmentReturnPrice: SECTIONS.SHIPMENT_SETTINGS,
  shipmentExchangePrice: SECTIONS.SHIPMENT_SETTINGS,
  isBundleShipment: SECTIONS.SHIPMENT_SETTINGS,

  representativeName: SECTIONS.BUSINESS_LICENSE,
  businessRegistrationNumber: SECTIONS.BUSINESS_LICENSE,
  corporateRegistrationNumber: SECTIONS.BUSINESS_LICENSE,
  isSimpleTaxpayers: SECTIONS.BUSINESS_LICENSE,
  companyLocation: SECTIONS.BUSINESS_LICENSE,
  onlineSalesLicense: SECTIONS.BUSINESS_LICENSE,

  identificationCardOwner: SECTIONS.REGISTRATION_NUMBER,
  identificationCardNumber: SECTIONS.REGISTRATION_NUMBER,
  identificationCardIssueDate: SECTIONS.REGISTRATION_NUMBER,

  contactNumber: SECTIONS.PHONE_NUMBER,

  bankAccountNumber: SECTIONS.SETTLEMENT_ACCOUNT,
  bankAccountHolder: SECTIONS.SETTLEMENT_ACCOUNT,
  bankName: SECTIONS.SETTLEMENT_ACCOUNT,
});

export const sectionReferenceVar = makeVar({
  [SECTIONS.SHOP_INFO]: null,
  [SECTIONS.SHOP_POLICY]: null,
  [SECTIONS.SAFETY_CERTIFICATION]: null,
  [SECTIONS.SHIPMENT_SETTINGS]: null,
  [SECTIONS.BUSINESS_LICENSE]: null,
  [SECTIONS.REGISTRATION_NUMBER]: null,
  [SECTIONS.PHONE_NUMBER]: null,
  [SECTIONS.SETTLEMENT_ACCOUNT]: null,
});
