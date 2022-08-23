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

  return regExp.test(value) && !isNaN(Number(value));
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
  allowsZeroInputNames?: Array<string>
): {
  isFulfilled: boolean;
  unfulfilledInputNames: Array<string>;
} {
  const inputNames = Object.keys(inputFields);
  const inputValues = Object.values(inputFields);

  const isFulfilled = inputValues.reduce(
    (acc: boolean, cur: string, index: number) => {
      const inputName = inputNames[index];

      const hasAllowedZero = allowsZeroInputNames.find(
        (allowedInputName) => allowedInputName === inputName
      );

      return acc && validateInput(cur, Boolean(hasAllowedZero));
    },
    true
  ) as boolean;

  return {
    isFulfilled,
    unfulfilledInputNames: [],
  };
}

function validateInput(
  input: string | number | boolean | undefined | null,
  allowsZero?: boolean
) {
  switch (typeof input) {
    case "string":
      return input !== "" ? true : false;
    case "number":
      if (allowsZero) {
        return true;
      }

      return input !== 0 ? true : false;
    case "boolean":
      return true;
    default:
      return false;
  }
}

function isElementOverflown(element: HTMLDivElement | null): void | boolean {
  if (!element) return;

  return element?.scrollHeight > element?.clientHeight;
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
};
