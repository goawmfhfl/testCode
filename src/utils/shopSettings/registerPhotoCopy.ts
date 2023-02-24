import { UploadFileType } from "@models/index";
import { addImageOnServer, removeImageFromServer } from "@utils/index";

const registerPhotoCopy = async (
  photoCopy: { url: string; file?: File } | null,
  previousPhotoCopy: { url: string; file?: File }
): Promise<string | null> => {
  if (!photoCopy) return null;

  // base64 or registered S3 url
  let result: string = photoCopy.url;

  if (photoCopy.url !== previousPhotoCopy.url) {
    const res = await addImageOnServer([photoCopy.file]);

    await removeImageFromServer([
      {
        type: UploadFileType.IDENTIFICATION_PHOTO_COPY,
        url: previousPhotoCopy.url,
      },
    ]);

    result = res[0].url;
  }

  return result;
};

export default registerPhotoCopy;
