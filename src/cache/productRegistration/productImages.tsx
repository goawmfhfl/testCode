import { v4 as uuidv4 } from "uuid";
import { makeVar } from "@apollo/client";

import { ProductImageType, UploadedFileType } from "@models/productImages";

export const requiredImagesVar = makeVar<Array<ProductImageType>>([
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_THUMBNAIL,
  },
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_REQUIRED,
  },
]);

export const optionalImagesVar = makeVar<Array<ProductImageType>>([
  {
    id: uuidv4(),
    url: "",
    type: UploadedFileType.PRODUCT_OPTIONAL,
  },
]);
