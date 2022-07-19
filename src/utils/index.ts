import axios from "axios";

export interface RemoveImageErrorType {
  code: string;
  message: string;
  statusCode: string;
}

async function addImageOnServer(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", imageFile);

  const response: { data: Array<string> } = await axios.post(
    "https://dev.chopsticks-store.com/upload",
    formData
  );

  return response.data[0];
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

function hasImageSmallerDimension({
  file,
  limitedDimension: { width, height },
}: {
  file: File;
  limitedDimension: {
    width: number;
    height: number;
  };
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result as string;

        img.onload = function () {
          const imageWidth = img.width;
          const imageHeight = img.height;

          if (imageWidth < width || imageHeight < height) {
            resolve(false);
          } else {
            resolve(true);
          }
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

function validateFileExtension(file: File, extensions: Array<string>) {
  const isValid = extensions.find((item) => item === file.type);

  return Boolean(isValid);
}

interface ValidateImageArguments {
  file: File;
  validator: {
    width: number;
    height: number;
    size: number;
    extensions: Array<string>;
  };
}

async function validateImage({
  file,
  validator: { width, height, size, extensions },
}: ValidateImageArguments): Promise<string> {
  const isDimensionValid: boolean = await hasImageSmallerDimension({
    file,
    limitedDimension: {
      width,
      height,
    },
  });

  const isSizeValid = validateImageSize(file, size);

  const isExtensionValid = validateFileExtension(file, extensions);

  let invalidMessage = "";

  invalidMessage += isDimensionValid
    ? ``
    : `이미지 크기를 확인해주세요! 이미지의 가로길이는 ${width}px, 높이는 ${height}px보다 커야합니다.`;

  invalidMessage += isSizeValid
    ? ``
    : `\n이미지 사이즈를 확인해주세요! 이미지 사이즈는 ${
        size / 1024 ** 2
      }MB 이하여야 합니다.`;

  invalidMessage += isExtensionValid
    ? ``
    : `이미지 확장자가 올바르지 않습니다! png, jpg, jpeg 확장자의 이미지만 등록이 가능합니다.`;

  return invalidMessage;
}

export { addImageOnServer, removeImageFromServer, validateImage };
