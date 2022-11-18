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
  registrationNumberVar,
  phoneNumberVar,
  settlementAccountVar,
  shopImagesVar,
} from "@cache/shopSettings";
import { ShopFormFields } from "@models/shopSettings";
import { UploadedFileType } from "@models/productImages";

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
    businessRegistrationNumber,
    corporateRegistrationNumber,
    isSimpleTaxpayers,
    companyLocation,
    onlineSalesLicense,
    identificationCardOwner,
    identificationCardNumber,
    identificationCardIssueDate,
    phoneNumber,
    bankName,
    bankAccountNumber,
    bankAccountHolder,
  } = shopInfo;

  const mobileImage = uploadedFileUrls.find(
    (file) => file.type === UploadedFileType.SHOP_MOBILE
  );
  const pcImage = uploadedFileUrls.find(
    (file) => file.type === UploadedFileType.SHOP_PC
  );

  shopImagesVar({
    mobileImage: mobileImage.url,
    pcImage: pcImage.url,
  });
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

  setValue(SHIPMENT_BUNDLING, isBundleShipment ? "가능" : "불가능");
  setValue(SHIPMENT_PRICE, shipmentPrice);
  setValue(SHIPMENT_DISTANT_PRICE, shipmentDistantPrice);
  setValue(SHIPMENT_CONDITIONAL_PRICE, shipmentConditionalPrice);
  setValue(SHIPMENT_RETURN_PRICE, shipmentReturnPrice);
  setValue(SHIPMENT_EXCHANGE_PRICE, shipmentExchangePrice);
  setValue(SHIPMENT_PRICE_TYPE, shipmentType);

  if (
    representativeName &&
    businessRegistrationNumber &&
    corporateRegistrationNumber &&
    isSimpleTaxpayers !== null &&
    companyLocation &&
    onlineSalesLicense
  ) {
    businessLicenseVar({
      isConfirmed: true,
      representativeName,
      businessRegistrationNumber,
      corporateRegistrationNumber,
      isSimpleTaxpayers: isSimpleTaxpayers ? "대상" : "대상 아님",
      companyLocation,
      onlineSalesLicense,
    });
  }

  if (
    identificationCardOwner &&
    identificationCardNumber &&
    identificationCardIssueDate
  ) {
    registrationNumberVar({
      isConfirmed: true,
      identificationCardOwner,
      identificationCardNumber,
      identificationCardIssueDate,
    });
  }

  phoneNumberVar(phoneNumber);

  if (bankName && bankAccountNumber && bankAccountHolder) {
    settlementAccountVar({
      hasInformation: true,
      accountName: bankAccountHolder,
      accountNumber: bankAccountNumber,
      bankName,
    });
  }
}
