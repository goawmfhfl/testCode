import { v4 as uuidv4 } from "uuid";
import { makeVar } from "@apollo/client";
import { DescriptionImage } from "@models/product/descriptionImages";
import { UploadFileType } from "@models/index";

export const descriptionImagesInitialValue = [
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    size: 0,
    type: UploadFileType.PRODUCT_DETAIL_PAGE,
  },
];

export const descriptionImagesVar = makeVar<Array<DescriptionImage>>(
  descriptionImagesInitialValue
);
