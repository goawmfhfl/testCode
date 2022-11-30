import { gql } from "@apollo/client";

export const VALIDATE_SAFETY_NUMBER = gql`
  query ValidateSafetyNumber($input: ValidateSafetyNumberInput!) {
    validateSafetyNumber(input: $input) {
      ok
      error
      data
    }
  }
`;

export interface ParsedValidateSafetyNumberResult {
  rows: {
    count: string;
    pagenum: string;
    pagesize: string;
    resultcode: string;
    row: {
      comp_nm: string;
      df: string;
      eff_prd: string;
      expired_date: string;
      inspct_org: string;
      item: string;
      mf_icm: string;
      mod_date: string;
      pkg_unit: string;
      prdt_nm: string;
      prdt_type: string;
      renew_yn: string;
      safe_sd: string;
      slfsfcfst_no: string;
      start_date: string;
      sttus: string;
      valid_yn: string;
    };
  };
  error: {
    msg: string;
    resultcode: string;
  };
}
