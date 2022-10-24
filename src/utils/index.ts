import axios from "axios";

export interface RemoveImageErrorType {
  code: string;
  message: string;
  statusCode: string;
}

async function addImageOnServer(imageFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("files", imageFile);

    const response: { data: Array<string> } = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}/upload`,
      formData
    );

    return response.data[0];
  } catch (error) {
    console.log("Error: 이미지 서버 등록 에러", error);
  }
}

async function removeImageFromServer(url: string): Promise<{
  result: string;
  error: RemoveImageErrorType;
}> {
  const {
    data: { result, error },
  }: {
    data: {
      result: string;
      error: RemoveImageErrorType;
    };
  } = await axios.delete("https://dev.chopsticks-store.com/upload", {
    data: {
      url,
    },
  });

  return {
    result,
    error,
  };
}

function validateImageDimensionRatio(
  file: File,
  dimensionRatio: {
    width: number;
    height: number;
  }
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result as string;

        img.onload = function () {
          const imageWidth = img.width;
          const imageHeight = img.height;

          const hasImageDimensionRatioFulfilled =
            imageWidth * dimensionRatio.height ===
            imageHeight * dimensionRatio.width;

          resolve(hasImageDimensionRatioFulfilled);
        };
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

function validateImageSize(file: File, limitedSize: number): boolean {
  return file.size < limitedSize;
}

function isNumber(value: string) {
  const regExp = /^[0-9]*$/g;

  return regExp.test(value);
}

function isVacantString(value) {
  if (value === "") return false;

  return true;
}

function removeLeadingZero(value: number) {
  return Number(value).toString();
}

function validatePhoneNumber(input: string) {
  const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

  if (!regex.test(input)) {
    return false;
  }

  return true;
}

// form 제출 시 전체 input validation을 위해 사용
function hasEveryInputFulfilled(
  inputFields: object,
  optionalInputNames?: Array<string>, // null 또는 undefined 허용
  allowsZeroInputNames?: Array<string> // 0 허용
): {
  isFulfilled: boolean;
  unfulfilledInputNames: Array<string>;
} {
  const unfulfilledInputNames = [];

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

      // Array - shop images (uploadedFileInfos)
      if (inputValue instanceof Array && inputName === "uploadedFileInfos") {
        const hasFulfilled = inputValue.reduce(
          (acc: boolean, cur: { url: string; type: string }) =>
            acc && Boolean(cur.url) && Boolean(cur.type),
          true
        ) as boolean;

        if (!hasFulfilled) {
          unfulfilledInputNames.push(inputName);

          return false;
        }

        return acc;
      }

      // Array - colors
      if (inputValue instanceof Array && inputName === "colors") {
        if (!inputValue.length) {
          unfulfilledInputNames.push(inputName);

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
          unfulfilledInputNames.push("requiredOptions");
          result = false;
        }

        if (hasSelectiveOptions && !isSelectiveOptionValid) {
          unfulfilledInputNames.push("selectiveOptions");
          result = false;
        }

        return acc && result;
      }

      // Object - manufacturingLeadTime
      if (
        typeof inputValue === "object" &&
        inputName === "manufacturingLeadTime"
      ) {
        if (!inputValue || !Object.keys(inputValue).length) {
          return false;
        }

        const hasValidMinProperty = Object.prototype.hasOwnProperty.call(
          inputValue,
          "min"
        ) as boolean;
        const hasValidMaxProperty = Object.prototype.hasOwnProperty.call(
          inputValue,
          "max"
        ) as boolean;

        return acc && hasValidMinProperty && hasValidMaxProperty;
      }

      // Array - tagInfos
      if (inputValue instanceof Array && inputName === "tagInfos") {
        if (!inputValue.length) {
          unfulfilledInputNames.push(inputName);

          return false;
        }

        return acc;
      }

      // string
      if (typeof inputValue === "string") {
        const isValid = isVacantString(inputValue);

        if (!isValid) {
          unfulfilledInputNames.push(inputName);
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
          unfulfilledInputNames.push(inputName);

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

      unfulfilledInputNames.push(inputName);

      return false;
    },
    true
  ) as boolean;

  return {
    isFulfilled,
    unfulfilledInputNames,
  };
}

function validateNumber(input: number, allowsZero: boolean) {
  if (allowsZero) {
    return true;
  }

  return input !== 0 ? true : false;
}

function isElementOverflown(element: HTMLDivElement | null): void | boolean {
  if (!element) return;

  return element?.scrollHeight > element?.clientHeight;
}

function getDiscountRate(originalPrice: number, discountAmount: number) {
  return Math.floor((discountAmount / originalPrice) * 100);
}

export {
  addImageOnServer,
  removeImageFromServer,
  validateImageDimensionRatio,
  validateImageSize,
  isNumber,
  isVacantString,
  removeLeadingZero,
  validatePhoneNumber,
  hasEveryInputFulfilled,
  isElementOverflown,
  getDiscountRate,
};
