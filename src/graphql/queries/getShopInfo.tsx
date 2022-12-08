import { gql } from "@apollo/client";
import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";

export interface ShopInfo {
  id: number;
  koreanName: string;
  englishName: string;
  description: string;
  uploadedFileUrls: Array<{
    url: string;
    type: UploadFileType;
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
  identificationCardNumber: string;
  identificationCardCopyPhoto: string;
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
      ok
      error
      shop {
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
        identificationCardNumber
        identificationCardCopyPhoto
        phoneNumber
        bankName
        bankAccountNumber
        bankAccountHolder
        createdAt
        updatedAt
        registered
      }
    }
  }
`;
