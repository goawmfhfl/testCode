import { v4 as uuidv4 } from "uuid";
import { UseFormReturn } from "react-hook-form";
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
import {
  IS_BUNDLE_SHIPMENT,
  LEAD_TIME_MAX,
  LEAD_TIME_MIN,
  PRODUCT_PRICE,
  PRODUCT_STOCK,
  SHIPMENT_TEMPLATE_ID,
} from "@cache/productForm";

export default function resetForm({
  reset,
  setValue,
}: UseFormReturn<ProductFormValues, any>) {
  reset();
  setValue(IS_BUNDLE_SHIPMENT, "가능");
  setValue(SHIPMENT_TEMPLATE_ID, null);
  setValue(LEAD_TIME_MIN, null);
  setValue(LEAD_TIME_MAX, null);
  setValue(PRODUCT_PRICE, null);
  setValue(PRODUCT_STOCK, null);

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
