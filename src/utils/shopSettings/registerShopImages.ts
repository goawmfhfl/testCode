import { UploadFileType } from "@models/index";
import { ShopImageVariables } from "@models/shopSettings";
import { addImageOnServer, removeImageFromServer } from "@utils/index";
import { cloneDeep } from "lodash";

const registerShopImages = async (
  images: ShopImageVariables,
  serversideImages: ShopImageVariables
): Promise<ShopImageVariables> => {
  const registeredImages = cloneDeep(images);

  const isMobileImageUpdated =
    images.mobileImage.url !== serversideImages.mobileImage.url;

  if (isMobileImageUpdated) {
    const response = await addImageOnServer([images.mobileImage.file]);

    registeredImages.mobileImage.url = response[0].url;

    if (serversideImages.mobileImage.url) {
      await removeImageFromServer([
        {
          type: UploadFileType.SHOP_MOBILE,
          url: serversideImages.mobileImage.url,
        },
      ]);
    }
  }

  const isPCImageUpdated = images.pcImage.url !== serversideImages.pcImage.url;

  if (isPCImageUpdated) {
    const response = await addImageOnServer([images.pcImage.file]);

    registeredImages.pcImage.url = response[0].url;

    if (serversideImages.pcImage.url) {
      await removeImageFromServer([
        {
          type: UploadFileType.SHOP_MOBILE,
          url: serversideImages.pcImage.url,
        },
      ]);
    }
  }

  return registeredImages;
};

export default registerShopImages;
