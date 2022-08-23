import { makeVar } from "@apollo/client";

import {
  SafetyCertificationVariables,
  BusinessLicenseVariables,
  SettlementAccountVariables,
  RegistrationVariables,
} from "@models/shopSettings";

export const safetyCertificationVar = makeVar<SafetyCertificationVariables>({
  isConfirmed: false,
  safetyAuthenticationNumber: "",
  safetyAuthenticationExpiredDate: null,
});

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
