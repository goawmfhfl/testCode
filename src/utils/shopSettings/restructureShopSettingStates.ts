import { UseFormWatch } from "react-hook-form";

import { UploadFileType } from "@models/index";
import { SaveShopSettingsInputType } from "@models/shopSettings";

import {
  SHOP_INTRODUCTION,
  SHIPMENT_POLICY,
  RETURN_POLICY,
  SHIPMENT_BUNDLING,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SHIPMENT_CONDITIONAL_PRICE,
  shopImagesVar,
  safetyCertificationVar,
  businessLicenseVar,
  registrationNumberVar,
  phoneNumberVar,
  settlementAccountVar,
} from "@cache/shopSettings";

import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";

export default function restructureShopSettingStates(
  watch: UseFormWatch<Record<string, any>>
): SaveShopSettingsInputType {
  const description = watch(SHOP_INTRODUCTION) as string;
  const shipmentPolicy = watch(SHIPMENT_POLICY) as string;
  const returnPolicy = watch(RETURN_POLICY) as string;

  const { safetyAuthenticationNumber, safetyAuthenticationExpiredDate } =
    safetyCertificationVar();

  const isBundleShipment = watch(SHIPMENT_BUNDLING) === "가능" ? true : false;
  const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
  const shipmentPrice = Number(watch(SHIPMENT_PRICE));
  const shipmentDistantPrice = Number(watch(SHIPMENT_DISTANT_PRICE));

  const shipmentReturnPrice = Number(watch(SHIPMENT_RETURN_PRICE));
  const shipmentExchangePrice = Number(watch(SHIPMENT_EXCHANGE_PRICE));
  const shipmentConditionalPrice = Number(watch(SHIPMENT_CONDITIONAL_PRICE));

  const uploadedFileInfos = [
    {
      url: shopImagesVar().mobileImage,
      type: UploadFileType.SHOP_MOBILE,
    },
    {
      url: shopImagesVar().pcImage,
      type: UploadFileType.SHOP_PC,
    },
  ];

  const {
    representativeName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers,
    companyLocation,
    onlineSalesLicense,
  } = businessLicenseVar();

  const {
    identificationCardOwner,
    identificationCardNumber,
    identificationCardIssueDate,
  } = registrationNumberVar();

  const phoneNumber = phoneNumberVar();

  const {
    accountNumber: bankAccountNumber,
    accountName: bankAccountHolder,
    bankName,
  } = settlementAccountVar();

  const input = {
    uploadedFileInfos,
    description,
    shipmentPolicy,
    returnPolicy,
    safetyAuthentication: safetyAuthenticationNumber,
    safetyAuthenticationExpiredDate: new Date(safetyAuthenticationExpiredDate),
    shipmentType,
    shipmentPrice,
    shipmentDistantPrice,
    shipmentReturnPrice,
    shipmentExchangePrice,
    shipmentConditionalPrice,
    isBundleShipment,
    representativeName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers: isSimpleTaxpayers === "대상" ? true : false,
    companyLocation,
    onlineSalesLicense,
    identificationCardOwner,
    identificationCardNumber,
    identificationCardIssueDate,
    phoneNumber,
    bankAccountNumber,
    bankAccountHolder,
    bankName,
  };

  return input;
}
