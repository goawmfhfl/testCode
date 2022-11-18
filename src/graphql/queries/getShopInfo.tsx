import { gql } from "@apollo/client";
import { UploadedFileType } from "@models/productImages";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";

export interface ShopInfo {
  id: number;
  koreanName: string;
  englishName: string;
  description: string;
  uploadedFileUrls: Array<{
    url: string;
    type: UploadedFileType;
  }>;
  shipmentPolicy: string;
  returnPolicy: string;
  safetyAuthentication: string;
  safetyAuthenticationExpiredDate: string;
  isBundleShipment: boolean;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentConditionalPrice: number;
  shipmentReturnPrice: number;
  shipmentExchangePrice: number;
  shipmentType: ShipmentChargeType;
  representativeName: string;
  businessRegistrationNumber: string;
  corporateRegistrationNumber: string;
  isSimpleTaxpayers: boolean;
  companyLocation: string;
  onlineSalesLicense: string;
  identificationCardOwner: string;
  identificationCardNumber: string;
  identificationCardIssueDate: Date;
  phoneNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  createdAt: Date;
  updatedAt: Date;
  registered: boolean;
}

export const GET_SHOP_INFO = gql`
  query GetShopInfo {
    getShopInfo {
      id
      koreanName
      englishName
      description
      uploadedFileUrls {
        url
        type
      }
      shipmentPolicy
      returnPolicy
      safetyAuthentication
      safetyAuthenticationExpiredDate
      isBundleShipment
      shipmentPrice
      shipmentDistantPrice
      shipmentConditionalPrice
      shipmentReturnPrice
      shipmentExchangePrice
      shipmentType
      representativeName
      businessRegistrationNumber
      corporateRegistrationNumber
      isSimpleTaxpayers
      companyLocation
      onlineSalesLicense
      identificationCardOwner
      identificationCardNumber
      identificationCardIssueDate
      phoneNumber
      bankName
      bankAccountNumber
      bankAccountHolder
      createdAt
      updatedAt
      registered
    }
  }
`;
