import X2JS from "x2js";
import { ParsedValidateSafetyNumberResult } from "@graphql/queries/validateSafetyNumber";

export const parseXMLString = (xmlResponseDataString: string) => {
  const x2js = new X2JS();

  const parsedResult: ParsedValidateSafetyNumberResult = x2js.xml2js(
    xmlResponseDataString
  );

  return parsedResult;
};

export const evaluateSafetyCertificationResponse = (
  parsed: ParsedValidateSafetyNumberResult
): {
  hasNoData: boolean;
  hasWrongAuthenticationNumber: boolean;
} => {
  const hasNoData = parsed.rows.count === "0";
  const hasWrongAuthenticationNumber = parsed.rows?.row?.valid_yn === "N";

  return {
    hasNoData,
    hasWrongAuthenticationNumber,
  };
};
