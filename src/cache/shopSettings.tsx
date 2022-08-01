import { makeVar } from "@apollo/client";

export const safetyCertificationVar = makeVar({
  isConfirmed: false,
});

export const businessLicenseVar = makeVar({
  rprsvNm: "",
  bizrno: "",
  crno: "",
  simTxtnTrgtYnDesc: "",
  rdnAddr: "",
  prmsnMgtNo: "",
});

export const phoneNumberVar = makeVar("");

export const settlementAccountVar = makeVar({
  hasInformation: false,
  accountName: "",
  accountNumber: "",
  bankCode: "",
  bankName: "",
});
