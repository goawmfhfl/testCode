import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import {
  RETURN_POLICY,
  SHIPMENT_POLICY,
  SHOP_INTRODUCTION,
  SHIPMENT_BUNDLING,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SHIPMENT_CONDITIONAL_PRICE,
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
} from "@cache/shopSettings";
import { ConditionalFreeShipmentPolicy } from "@constants/shop";

export interface ShopFormFields {
  [SHOP_INTRODUCTION]: string;
  [SHIPMENT_POLICY]: string;
  [RETURN_POLICY]: string;
  [SHIPMENT_BUNDLING]: string;
  [SHIPMENT_PRICE_TYPE]: ShipmentChargeType;
  [SHIPMENT_PRICE]: number;
  [SHIPMENT_DISTANT_PRICE]: number;
  [SHIPMENT_RETURN_PRICE]: number;
  [SHIPMENT_EXCHANGE_PRICE]: number;
  [HAS_SET_CONDITIONAL_FREE_SHIPMENT]: ConditionalFreeShipmentPolicy;
  [SHIPMENT_CONDITIONAL_PRICE]: number;
  IDENTIFICATION: {
    REGISTRATION_NUMBER: {
      PREFIX: string;
      SUFFIX: string;
    };
    PHOTOCOPY: string;
  };
}

export type InputValueTypes =
  | string
  | number
  | boolean
  | Date
  | Array<{ url: string; type: UploadFileType }>;

export interface ShopImageVariables {
  mobileImage: string;
  pcImage: string;
}

export interface SafetyCertificationVariables {
  isConfirmed: boolean;
  safetyAuthenticationNumber: string;
  safetyAuthenticationExpiredDate: string;
}

export interface BusinessLicenseVariables {
  isConfirmed: boolean;
  representativeName: string;
  businessRegistrationNumber: string;
  corporateRegistrationNumber: string;
  isSimpleTaxpayers: string;
  companyLocation: string;
  onlineSalesLicense: string;
}

export interface SettlementAccountVariables {
  hasInformation: boolean;
  accountName: string;
  accountNumber: string;
  bankCode?: string;
  bankName: string;
}

export interface SaveShopSettingsInputType {
  uploadedFileInfos: Array<{ url: string; type: UploadFileType }>;
  description: string;
  shipmentPolicy: string;
  returnPolicy: string;

  safetyAuthentication: string;
  safetyAuthenticationExpiredDate: Date;

  isBundleShipment: boolean;
  shipmentType: ShipmentChargeType;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentReturnPrice: number;
  shipmentExchangePrice: number;
  shipmentConditionalPrice: number | null;

  representativeName: string;
  businessRegistrationNumber: string;
  corporateRegistrationNumber: string;
  isSimpleTaxpayers: boolean;
  companyLocation: string;
  onlineSalesLicense: string;

  identificationCardNumber?: string;
  identificationCardCopyPhoto?: string;

  phoneNumber: string;

  bankAccountNumber: string;
  bankAccountHolder: string;
  bankName: string;
}

export type TemporarySaveShopSettingsInputType =
  Partial<SaveShopSettingsInputType>;
