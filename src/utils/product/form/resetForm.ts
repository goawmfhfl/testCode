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
import {
  requiredOptionInitialState,
  requiredOptionVar,
  selectiveOptionInitialState,
  selectiveOptionVar,
} from "@cache/productForm/productOptions";
import { tagListVar } from "@cache/productForm/searchTag";

export default function resetForm(reset: UseFormReset<ProductFormValues>) {
  reset();

  initializeProductImages();
  initializeOptionalImages();
  initializeDescriptionImages();
  initializeOptions();
  initializeTags();
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

function initializeOptions() {
  initializeRequiredOptions();
  initializeSelectiveOptions();
}

function initializeRequiredOptions() {
  requiredOptionVar(requiredOptionInitialState);
}

function initializeSelectiveOptions() {
  selectiveOptionVar(selectiveOptionInitialState);
}

function initializeTags() {
  tagListVar([]);
}
