import { v4 as uuidv4 } from "uuid";
import { makeVar } from "@apollo/client";

import { UploadFileType } from "@models/index";
import { ProductImageType } from "@models/product/productImages";

export const requiredImagesInitialValue = [
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    type: UploadFileType.PRODUCT_THUMBNAIL,
  },
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    type: UploadFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    type: UploadFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    type: UploadFileType.PRODUCT_REQUIRED,
  },
  {
    id: uuidv4(),
    filename: "",
    file: null,
    url: "",
    type: UploadFileType.PRODUCT_REQUIRED,
  },
];

export const requiredImagesVar = makeVar<Array<ProductImageType>>(
  requiredImagesInitialValue
);

export const optionalImagesInitialValue = [
  {
    id: uuidv4(),
    filename: "",
    url: "",
    type: UploadFileType.PRODUCT_OPTIONAL,
  },
];

export const optionalImagesVar = makeVar<Array<ProductImageType>>(
  optionalImagesInitialValue
);
