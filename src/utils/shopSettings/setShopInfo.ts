import { UseFormSetValue } from "react-hook-form";

import { ShopInfo } from "@graphql/queries/getShopInfo";
import {
  RETURN_POLICY,
  SHIPMENT_POLICY,
  SHOP_INTRODUCTION,
  safetyCertificationVar,
  SHIPMENT_BUNDLING,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SHIPMENT_CONDITIONAL_PRICE,
  businessLicenseVar,
  phoneNumberVar,
  settlementAccountVar,
  shopImagesVar,
  REGISTRATION_NUMBER_PREFIX,
  REGISTRATION_NUMBER_SUFFIX,
  PHOTOCOPY,
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
  serversideShopImagesVar,
  serversideIdentificationPhotoCopy,
} from "@cache/shopSettings";
import { ShopFormFields } from "@models/shopSettings";
import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import { ConditionalFreeShipmentPolicy } from "@constants/shop";

export default function setShopInfo(
  shopInfo: ShopInfo,
  setValue: UseFormSetValue<ShopFormFields>
) {
  const {
    uploadedFileUrls,
    description,
    shipmentPolicy,
    returnPolicy,
    safetyAuthentication: safetyAuthenticationNumber,
    safetyAuthenticationExpiredDate,
    isBundleShipment,
    shipmentPrice,
    shipmentDistantPrice,
    shipmentConditionalPrice,
    shipmentReturnPrice,
    shipmentExchangePrice,
    shipmentType,
    representativeName,
    businessName,
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers,
    companyLocation,
    onlineSalesLicense,
    identificationCardNumber,
    identificationCardCopyPhoto,
    phoneNumber,
    bankName,
    bankAccountNumber,
    bankAccountHolder,
  } = shopInfo;

  const mobileImage = uploadedFileUrls.find(
    (file) => file.type === UploadFileType.SHOP_MOBILE
  );

  const pcImage = uploadedFileUrls.find(
    (file) => file.type === UploadFileType.SHOP_PC
  );

  if (mobileImage && mobileImage.url) {
    shopImagesVar({
      ...shopImagesVar(),
      mobileImage: {
        url: mobileImage.url,
        file: null,
      },
    });

    serversideShopImagesVar({
      ...shopImagesVar(),
      mobileImage: {
        url: mobileImage.url,
        file: null,
      },
    });
  }

  if (pcImage && pcImage.url) {
    shopImagesVar({
      ...shopImagesVar(),
      pcImage: {
        url: pcImage.url,
        file: null,
      },
    });

    serversideShopImagesVar({
      ...shopImagesVar(),
      pcImage: {
        url: pcImage.url,
        file: null,
      },
    });
  }

  setValue(SHOP_INTRODUCTION, description);
  setValue(SHIPMENT_POLICY, shipmentPolicy);
  setValue(RETURN_POLICY, returnPolicy);

  if (safetyAuthenticationNumber && safetyAuthenticationExpiredDate) {
    safetyCertificationVar({
      isConfirmed: true,
      safetyAuthenticationNumber,
      safetyAuthenticationExpiredDate,
    });
  }

  setValue(SHIPMENT_BUNDLING, isBundleShipment ? "??????" : "?????????");
  setValue(SHIPMENT_PRICE, shipmentPrice);
  setValue(SHIPMENT_DISTANT_PRICE, shipmentDistantPrice);
  setValue(
    HAS_SET_CONDITIONAL_FREE_SHIPMENT,
    shipmentConditionalPrice
      ? ConditionalFreeShipmentPolicy.Set
      : ConditionalFreeShipmentPolicy.Unset
  );
  setValue(SHIPMENT_CONDITIONAL_PRICE, shipmentConditionalPrice);
  setValue(SHIPMENT_RETURN_PRICE, shipmentReturnPrice);
  setValue(SHIPMENT_EXCHANGE_PRICE, shipmentExchangePrice);
  setValue(
    SHIPMENT_PRICE_TYPE,
    shipmentType ? shipmentType : ShipmentChargeType.Charged
  );

  if (
    representativeName &&
    businessName &&
    businessRegistrationNumber &&
    corporateRegistrationNumber &&
    isSimpleTaxpayers !== null &&
    companyLocation &&
    onlineSalesLicense
  ) {
    businessLicenseVar({
      isConfirmed: true,
      representativeName,
      businessName,
      businessRegistrationNumber,
      corporateRegistrationNumber,
      isSimpleTaxpayers: isSimpleTaxpayers ? "??????" : "?????? ??????",
      companyLocation,
      onlineSalesLicense,
    });
  }

  if (identificationCardNumber) {
    const prefix = identificationCardNumber.split("-")[0];
    const suffix = identificationCardNumber.split("-")[1];

    setValue(REGISTRATION_NUMBER_PREFIX, prefix);
    setValue(REGISTRATION_NUMBER_SUFFIX, suffix);
  }

  if (identificationCardCopyPhoto) {
    setValue(PHOTOCOPY, {
      url: identificationCardCopyPhoto,
      file: null,
    });

    serversideIdentificationPhotoCopy({
      url: identificationCardCopyPhoto,
      file: null,
    });
  }

  if (phoneNumber) {
    phoneNumberVar(phoneNumber);
  }

  if (bankName && bankAccountNumber && bankAccountHolder) {
    settlementAccountVar({
      hasInformation: true,
      accountName: bankAccountHolder,
      accountNumber: bankAccountNumber,
      bankName,
    });
  }
}
