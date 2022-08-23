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
  bankCode: string;
  bankName: string;
}
