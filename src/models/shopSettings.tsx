import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";
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
} from "@cache/shopSettings";

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
  [SHIPMENT_CONDITIONAL_PRICE]: number;
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

export interface RegistrationVariables {
  isConfirmed: boolean;
  identificationCardOwner: string;
  identificationCardNumber: string;
  identificationCardIssueDate: Date;
}

export interface SettlementAccountVariables {
  hasInformation: boolean;
  accountName: string;
  accountNumber: string;
  bankCode?: string;
  bankName: string;
}

export interface TemporarySaveShopSettingsInputType {
  // 샵 정보
  uploadedFileInfos?: Array<{ url: string; type: UploadFileType }>;
  description?: string;
  shipmentPolicy?: string;
  returnPolicy?: string;

  // 안전 검사
  safetyAuthentication?: string;
  safetyAuthenticationExpiredDate?: Date;

  // 배송
  isBundleShipment?: boolean;
  shipmentType?: ShipmentChargeType;
  shipmentPrice?: number;
  shipmentDistantPrice?: number;
  shipmentReturnPrice?: number;
  shipmentExchangePrice?: number;
  shipmentConditionalPrice?: number | null;

  // 사업자 / 통신판매업
  representativeName?: string;
  businessRegistrationNumber?: string;
  corporateRegistrationNumber?: string;
  isSimpleTaxpayers?: boolean;
  companyLocation?: string;
  onlineSalesLicense?: string;

  // 주민등록증
  identificationCardOwner?: string;
  identificationCardNumber?: string;
  identificationCardIssueDate?: Date;

  // 전화번호
  phoneNumber?: string;

  // 정산 계좌
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  bankName?: string;
}

export interface SaveShopSettingsInputType {
  // 샵 정보
  uploadedFileInfos: Array<{ url: string; type: UploadFileType }>;
  description: string;
  shipmentPolicy: string;
  returnPolicy: string;

  // 안전 검사
  safetyAuthentication: string;
  safetyAuthenticationExpiredDate: Date;

  // 배송
  isBundleShipment: boolean;
  shipmentType: ShipmentChargeType;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentReturnPrice: number;
  shipmentExchangePrice: number;
  shipmentConditionalPrice: number | null;

  // 사업자 / 통신판매업
  representativeName: string;
  businessRegistrationNumber: string;
  corporateRegistrationNumber: string;
  isSimpleTaxpayers: boolean;
  companyLocation: string;
  onlineSalesLicense: string;

  // 주민등록증
  identificationCardOwner?: string;
  identificationCardNumber?: string;
  identificationCardIssueDate?: Date;

  // 전화번호
  phoneNumber: string;

  // 정산 계좌
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankName: string;
}
