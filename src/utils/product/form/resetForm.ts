import { v4 as uuidv4 } from "uuid";
import { UseFormReset } from "react-hook-form";
import { ProductFormValues } from "@models/product/index";

import {
  requiredImagesVar,
  optionalImagesVar,
  requiredImagesInitialValue,
  optionalImagesInitialValue,
} from "@cache/productForm/productImages";
import {
  descriptionImagesInitialValue,
  descriptionImagesVar,
} from "@cache/productForm/descriptionImages";

export default function resetForm(reset: UseFormReset<ProductFormValues>) {
  reset();

  // TODO: reactive var로 관리되는 인풋상태들을 모두 초기화
  initializeProductImages();
  initializeOptionalImages();
  initializeDescriptionImages();
}

function initializeProductImages() {
  requiredImagesVar([
    ...requiredImagesInitialValue.map((img) => ({
      ...img,
      id: uuidv4(),
      url: "",
    })),
  ]);
}

function initializeOptionalImages() {
  optionalImagesVar([
    ...optionalImagesInitialValue.map((img) => ({
      ...img,
      id: uuidv4(),
      url: "",
    })),
  ]);
}

function initializeDescriptionImages() {
  descriptionImagesVar([
    ...descriptionImagesInitialValue.map((img) => ({
      ...img,
      id: uuidv4(),
      url: "",
    })),
  ]);
}
