import { UnfulfilledStatus } from "@constants/index";
import { UploadFileType } from "@models/index";
import {
  createUnfulfilledInput,
  isVacantString,
  validateNumber,
} from "@utils/index";

const validateInputFulfillment = (
  inputFields: object,
  optionalInputNames?: Array<string>, // null 또는 undefined 허용
  allowsZeroInputNames?: Array<string> // 0 허용
): {
  isFulfilled: boolean;
  unfulfilledInputList: Array<{
    name: string;
    status: UnfulfilledStatus | string;
  }>;
} => {
  const unfulfilledInputList: Array<{
    name: string;
    status: UnfulfilledStatus | string;
  }> = [];

  const inputNames = Object.keys(inputFields);
  const inputValues = Object.values(inputFields);

  const isFulfilled = inputValues.reduce(
    (acc: boolean, inputValue: unknown, index: number) => {
      const inputName = inputNames[index];

      const isOptionalInput = optionalInputNames.find(
        (name) => name === inputName
      );

      if (isOptionalInput) {
        return acc;
      }

      if (inputValue instanceof Array && inputName === "uploadedFileInfos") {
        const uploadedUrls = inputValue.filter(({ url }) => url) as Array<{
          url: string;
          type: UploadFileType;
        }>;

        const shopImagePC = uploadedUrls.find(
          ({ type }) => type === UploadFileType.SHOP_PC
        );

        const shopImageMobile = uploadedUrls.find(
          ({ type }) => type === UploadFileType.SHOP_MOBILE
        );

        if (!shopImagePC || !shopImageMobile) {
          unfulfilledInputList.push(
            createUnfulfilledInput("shopInfo", UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        return acc;
      }

      // string
      if (typeof inputValue === "string") {
        const isValid = isVacantString(inputValue);

        if (!isValid) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );
        }

        return acc && isValid;
      }

      // number
      if (typeof inputValue === "number") {
        const hasAllowedZero = allowsZeroInputNames.find(
          (allowedInputName) => allowedInputName === inputName
        );

        const isValidNumber = validateNumber(
          inputValue,
          Boolean(hasAllowedZero)
        );

        if (!isValidNumber) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        return acc;
      }

      // boolean
      if (typeof inputValue === "boolean") {
        return acc;
      }

      // Date
      if (inputValue instanceof Date) {
        return acc;
      }

      unfulfilledInputList.push(
        createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
      );

      return false;
    },
    true
  ) as boolean;

  return {
    isFulfilled,
    unfulfilledInputList,
  };
};

export default validateInputFulfillment;
