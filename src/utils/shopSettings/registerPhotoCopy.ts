import { UploadFileType } from "@models/index";
import { addImageOnServer, removeImageFromServer } from "@utils/index";

const registerPhotoCopy = async (
  photoCopy: { url: string; file?: File } | null,
  serversidePhotocopy: { url: string; file?: File }
): Promise<string | null> => {
  if (!photoCopy) return null;

  // base64 or registered S3 url
  let result: string = photoCopy.url;

  if (photoCopy.url !== serversidePhotocopy.url) {
    const res = await addImageOnServer([photoCopy.file]);

    await removeImageFromServer([
      {
        type: UploadFileType.IDENTIFICATION_PHOTO_COPY,
        url: serversidePhotocopy.url,
      },
    ]);

    result = res[0].url;
  }

  return result;
};

export default registerPhotoCopy;
