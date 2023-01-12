import { UseFormWatch } from "react-hook-form";

import { UploadFileType } from "@models/index";
import { SaveShopSettingsInputType } from "@models/shopSettings";

import {
  SHOP_INTRODUCTION,
  SHIPMENT_POLICY,
  RETURN_POLICY,
  // SHIPMENT_BUNDLING,
  // SHIPMENT_PRICE_TYPE,
  // SHIPMENT_PRICE,
  // SHIPMENT_DISTANT_PRICE,
  // SHIPMENT_RETURN_PRICE,
  // SHIPMENT_EXCHANGE_PRICE,
  // SHIPMENT_CONDITIONAL_PRICE,
  shopImagesVar,
  safetyCertificationVar,
  businessLicenseVar,
  REGISTRATION_NUMBER_PREFIX,
  REGISTRATION_NUMBER_SUFFIX,
  PHOTOCOPY,
  phoneNumberVar,
  settlementAccountVar,
} from "@cache/shopSettings";

import { ShipmentChargeType } from "@models/product/shipmentTemplate";

const restructureShopSettingStates = (
  watch: UseFormWatch<Record<string, any>>
): SaveShopSettingsInputType => {
  const description = watch(SHOP_INTRODUCTION) as string;
  const shipmentPolicy = watch(SHIPMENT_POLICY) as string;
  const returnPolicy = watch(RETURN_POLICY) as string;

  const {
    isConfirmed,
    safetyAuthenticationNumber,
    safetyAuthenticationExpiredDate,
  } = safetyCertificationVar();

  // const isBundleShipment = watch(SHIPMENT_BUNDLING) === "가능" ? true : false;
  // const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
  // const shipmentPrice = Number(watch(SHIPMENT_PRICE));
  // const shipmentDistantPrice = Number(watch(SHIPMENT_DISTANT_PRICE));

  // const shipmentReturnPrice = Number(watch(SHIPMENT_RETURN_PRICE));
  // const shipmentExchangePrice = Number(watch(SHIPMENT_EXCHANGE_PRICE));
  // const shipmentConditionalPrice = watch(SHIPMENT_CONDITIONAL_PRICE) as
  //   | number
  //   | null;

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
    businessName,
    representativeName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers,
    companyLocation,
    onlineSalesLicense,
  } = businessLicenseVar();

  const registrationNumberPrefix = watch(REGISTRATION_NUMBER_PREFIX) as string;
  const registrationNumberSuffix = watch(REGISTRATION_NUMBER_SUFFIX) as string;
  const registrationNumber = `${registrationNumberPrefix}-${registrationNumberSuffix}`;

  const photoCopy = (watch(PHOTOCOPY) as string) || null;

  const phoneNumber = phoneNumberVar();

  const {
    accountNumber: bankAccountNumber,
    accountName: bankAccountHolder,
    bankName,
  } = settlementAccountVar();

  // const shipmentInputs = {
  //   shipmentType,
  //   shipmentPrice,
  //   shipmentDistantPrice,
  //   shipmentReturnPrice,
  //   shipmentExchangePrice,
  //   shipmentConditionalPrice:
  //     shipmentConditionalPrice !== null
  //       ? Number(shipmentConditionalPrice)
  //       : null,
  //   isBundleShipment,
  // };

  const tempShipmentInputs = {
    shipmentType: ShipmentChargeType.Free,
    shipmentPrice: 0,
    shipmentDistantPrice: 0,
    shipmentReturnPrice: 0,
    shipmentExchangePrice: 0,
    shipmentConditionalPrice: null,
    isBundleShipment: false,
  };

  const input = {
    uploadedFileInfos,
    description,
    shipmentPolicy,
    returnPolicy,
    safetyAuthentication: isConfirmed ? safetyAuthenticationNumber : null,
    safetyAuthenticationExpiredDate: isConfirmed
      ? new Date(safetyAuthenticationExpiredDate)
      : null,

    ...tempShipmentInputs,
    businessName,
    representativeName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers: isSimpleTaxpayers === "대상" ? true : false,
    companyLocation,
    onlineSalesLicense,
    identificationCardNumber: registrationNumber,
    identificationCardCopyPhoto: photoCopy,
    phoneNumber,
    bankAccountNumber,
    bankAccountHolder,
    bankName,
  };

  return input;
};

export default restructureShopSettingStates;
