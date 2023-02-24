import axios from "axios";

import { UnfulfilledStatus } from "@constants/index";
import { UploadedFileInfos } from "@models/product";

export interface RemoveImageErrorType {
  code: string;
  message: string;
  statusCode: string;
}

function isBase64Url(url: string) {
  try {
    window.atob(url.split(",")[1]);

    return true;
  } catch {
    return false;
  }
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      resolve(reader.result as string);
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}

function convertBase64ToFile(url: string, fileName: string) {
  const arr = url.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bufferString = window.atob(arr[1]);
  let n = bufferString.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bufferString.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

async function addImageOnServer(
  imageFiles: Array<File>
): Promise<Array<{ url: string; size: number }>> {
  try {
    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("files", file, encodeURIComponent(file.name));
    });

    const response: { data: Array<{ url: string; size: number }> } =
      await axios.post(`${process.env.REACT_APP_SERVER_URI}/upload`, formData);

    return response.data;
  } catch (error) {
    console.log("Error: 이미지 서버 등록 에러", error);
  }
}

async function removeImageFromServer(
  urls: Array<Omit<UploadedFileInfos, "size">>
): Promise<{
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
      urls,
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
  return Number((bytes / (1000 * 1000)).toFixed(2));
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

export {
  isBase64Url,
  convertFileToBase64,
  convertBase64ToFile,
  addImageOnServer,
  removeImageFromServer,
  validateImageDimensionRatio,
  validateImageSize,
  isNumber,
  isVacantString,
  removeLeadingZero,
  validatePhoneNumber,
  isElementOverflown,
  bytesToMegaBytes,
  preventNaNValues,
  validatePassword,
  createUnfulfilledInput,
  validateNumber,
};
