import { Pathnames, UnfulfilledStatus } from "@constants/index";
import { UploadFileType } from "@models/index";
import axios from "axios";
import { last } from "lodash";

export interface RemoveImageErrorType {
  code: string;
  message: string;
  statusCode: string;
}

async function addImageOnServer(
  imageFile: File
): Promise<{ url: string; size: number }> {
  try {
    const formData = new FormData();
    formData.append("files", imageFile, imageFile.name.replaceAll(" ", "_"));

    const response: { data: Array<{ url: string; size: number }> } =
      await axios.post(`${process.env.REACT_APP_SERVER_URI}/upload`, formData);

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
  } = await axios.delete(`${process.env.REACT_APP_SERVER_URI}/upload`, {
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
  allowsZeroInputNames?: Array<string>, // 0 허용
  formType?: Pathnames.Shop | Pathnames.ProductRegistration
): {
  isFulfilled: boolean;
  unfulfilledInputList: Array<{
    name: string;
    status: UnfulfilledStatus | string;
  }>;
} {
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

      // Array - Shop Images
      if (
        formType === Pathnames.Shop &&
        inputValue instanceof Array &&
        inputName === "uploadedFileInfos"
      ) {
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

      // Array - Product Images
      if (
        formType === Pathnames.ProductRegistration &&
        inputValue instanceof Array &&
        inputName === "uploadedFileInfos"
      ) {
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

      // Array - colors
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

      // Object - manufacturingLeadTime
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

      // Array - tagInfos
      if (inputValue instanceof Array && inputName === "tagInfos") {
        if (!inputValue.length) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, UnfulfilledStatus.Unfilled)
          );

          return false;
        }

        return acc;
      }

      if (
        typeof inputValue === "string" &&
        inputName === "productDescription"
      ) {
        if (inputValue.length < 50) {
          unfulfilledInputList.push(
            createUnfulfilledInput(inputName, "50자 이상 입력해주세요.")
          );

          return false;
        }
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
}

function createUnfulfilledInput(
  name: string,
  status: UnfulfilledStatus | string
) {
  return {
    name,
    status,
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

function bytesToMegaBytes(bytes: number) {
  return Number((bytes / (1024 * 1024)).toFixed(2));
}

function preventNaNValues(e: React.KeyboardEvent<HTMLInputElement>): void {
  const {
    nativeEvent: { altKey, metaKey, shiftKey },
  } = e;

  const hasMetaComposing = altKey || metaKey || shiftKey;

  if (
    e.key === "Backspace" ||
    e.key === "Tab" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "Meta" ||
    e.key === "Alt" ||
    hasMetaComposing
  ) {
    return;
  }

  if (!isNumber(e.key)) {
    e.preventDefault();

    return;
  }
}

function validatePassword(password: string) {
  const regex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

  return regex.test(password);
}

function encodeLastComponent(url: string) {
  const splited = url.split("/");

  const lastComponent = last(splited);
  splited.pop();

  const result = splited.join("/") + "/" + encodeURIComponent(lastComponent);

  return result;
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
  bytesToMegaBytes,
  preventNaNValues,
  validatePassword,
  encodeLastComponent,
};
