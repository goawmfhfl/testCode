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

      if (typeof inputValue === "string" && inputName === "description") {
        if (inputValue.length < 50) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, "50자 이상 입력해주세요.")
          );

          return false;
        }
      }

      if (inputValue instanceof Array && inputName === "uploadedFileInfos") {
        const uploadedUrls = inputValue.filter(({ url }) => url) as Array<{
          url: string;
          type: UploadFileType;
        }>;

        const thumbnail = uploadedUrls.find(
          (file) => file.type === UploadFileType.PRODUCT_THUMBNAIL
        );
        const requiredImages = uploadedUrls.filter(
          (file) => file.type === UploadFileType.PRODUCT_REQUIRED
        );
        const descriptionImages = uploadedUrls.filter(
          (file) => file.type === UploadFileType.PRODUCT_DETAIL_PAGE
        );

        const isRequiredImagesUnfulfilled =
          !thumbnail || requiredImages.length < 4;
        const isDescriptionImagesUnfulfilled = !descriptionImages.length;

        if (isRequiredImagesUnfulfilled) {
          unfulfilledInputList.push(
            createUnfulfilledInput("requiredImages", UnfulfilledStatus.Unfilled)
          );
        }

        if (isDescriptionImagesUnfulfilled) {
          unfulfilledInputList.push(
            createUnfulfilledInput(
              "descriptionImages",
              UnfulfilledStatus.Unfilled
            )
          );
        }

        if (isRequiredImagesUnfulfilled || isDescriptionImagesUnfulfilled) {
          return false;
        }

        return acc;
      }

      if (inputValue instanceof Array && inputName === "colors") {
        if (!inputValue.length) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        return acc;
      }

      if (inputValue instanceof Array && inputName === "optionCombinations") {
        const optionCombinations = inputValue as Array<{
          isRequired: boolean;
          quantity: number;
        }>;
        let result = true;

        const { requiredOptions, selectiveOptions } = optionCombinations.reduce(
          (
            counter: {
              requiredOptions: {
                numberOfOptions: number;
                stockSum: number;
              };
              selectiveOptions: {
                numberOfOptions: number;
                stockSum: number;
              };
            },
            {
              isRequired,
              quantity,
            }: {
              isRequired: boolean;
              quantity: number;
            }
          ) => {
            if (isRequired) {
              counter.requiredOptions.numberOfOptions++;
              counter.requiredOptions.stockSum += quantity;
            } else {
              counter.selectiveOptions.numberOfOptions++;
              counter.selectiveOptions.stockSum += quantity;
            }

            return counter;
          },
          {
            requiredOptions: {
              numberOfOptions: 0,
              stockSum: 0,
            },
            selectiveOptions: {
              numberOfOptions: 0,
              stockSum: 0,
            },
          }
        );

        const hasRequiredOptions = !optionalInputNames.find(
          (inputName) => inputName === "requiredOptions"
        );
        const hasSelectiveOptions = !optionalInputNames.find(
          (inputName) => inputName === "selectiveOptions"
        );

        const isRequiredOptionValid =
          Boolean(requiredOptions.numberOfOptions) &&
          Boolean(requiredOptions.stockSum);
        const isSelectiveOptionValid =
          Boolean(selectiveOptions.numberOfOptions) &&
          Boolean(selectiveOptions.stockSum);

        if (hasRequiredOptions && !isRequiredOptionValid) {
          unfulfilledInputList.push(
            createUnfulfilledInput(
              "requiredOptions",
              UnfulfilledStatus.Unfilled
            )
          );
          result = false;
        }

        if (hasSelectiveOptions && !isSelectiveOptionValid) {
          unfulfilledInputList.push(
            createUnfulfilledInput(
              "selectiveOptions",
              UnfulfilledStatus.Unfilled
            )
          );
          result = false;
        }

        return acc && result;
      }

      if (
        typeof inputValue === "object" &&
        inputName === "manufacturingLeadTime"
      ) {
        if (!inputValue || !Object.keys(inputValue).length) {
          return false;
        }

        const hasMinProperty = Object.prototype.hasOwnProperty.call(
          inputValue,
          "min"
        ) as boolean;
        const hasMaxProperty = Object.prototype.hasOwnProperty.call(
          inputValue,
          "max"
        ) as boolean;

        if (!hasMinProperty || !hasMaxProperty) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        const manufacturingLeadTime = inputValue as {
          min: number;
          max: number;
        };

        if (
          isNaN(manufacturingLeadTime["min"]) ||
          isNaN(manufacturingLeadTime["max"])
        ) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        return acc;
      }

      if (inputValue instanceof Array && inputName === "tagInfos") {
        if (!inputValue.length) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
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
