import { last } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, UseFormReset } from "react-hook-form";
import { ProductFormValues } from "@models/product/index";

import {
  TITLE,
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
  PRODUCT_DESCRIPTION,
  PRODUCT_COLOR,
  PRODUCT_PRICE,
  IS_DISCOUNTED,
  DISCOUNT_AMOUNT,
  DISCOUNT_OPTION,
  DISCOUNT_STARTS_AT,
  DISCOUNT_ENDS_AT,
  PRODUCT_STOCK,
  HAS_REQUIRED_OPTION,
  HAS_SELECTIVE_OPTION,
  HAS_MANUFACTURING_LEAD_TIME,
  LEAD_TIME_MIN,
  LEAD_TIME_MAX,
  SHIPMENT_TEMPLATE_ID,
  IS_BUNDLE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SPEC_NAME,
  MATERIAL,
  WEIGHT,
  SIZE,
  MANUFACTURER,
  PRECAUTION,
  AUTHORIZATION,
  PERSON_IN_CHARGE,
  HAS_TAG_INFOS,
  HAS_DISCOUNT_SPAN,
} from "@cache/productForm";
import {
  requiredImagesVar,
  optionalImagesVar,
  requiredImagesInitialValue,
  optionalImagesInitialValue,
} from "@cache/productForm/productImages";
import {
  requiredOptionVar,
  selectiveOptionVar,
} from "@cache/productForm/productOptions";
import { shipmentTemplatesVar } from "@cache/productForm/shipmentTemplate";
import { tagListVar } from "@cache/productForm/searchTag";

import { ColorType, UploadedFileInfos } from "@models/product/index";
import { TagTypes } from "@models/product/searchTag";
import {
  ShipmentChargeType,
  CreateShipmentInputType,
} from "@models/product/shipmentTemplate";
import {
  descriptionImagesInitialValue,
  descriptionImagesVar,
} from "@cache/productForm/descriptionImages";
import { CategoryNames } from "@constants/category";

export function restructureProductRegistrationStates(
  formContext: UseFormReturn
) {
  const { watch } = formContext;

  const name = watch(TITLE) as string;
  const description = watch(PRODUCT_DESCRIPTION) as string;
  const colors = (watch(PRODUCT_COLOR) as Array<ColorType>) || [];
  const originalPrice = watch(PRODUCT_PRICE) as string;

  const isDiscounted = watch(IS_DISCOUNTED) as boolean;
  const discountAmount = watch(DISCOUNT_AMOUNT) as string;
  const discountMethod = watch(DISCOUNT_OPTION) as string;

  const hasDiscountSpan = watch(HAS_DISCOUNT_SPAN) as boolean;
  const startDiscountDate = watch(DISCOUNT_STARTS_AT) as string;
  const endDiscountDate = watch(DISCOUNT_ENDS_AT) as string;

  const quantity = watch(PRODUCT_STOCK) as string;

  const hasRequiredOption = watch(HAS_REQUIRED_OPTION) as boolean;
  const hasSelectiveOption = watch(HAS_SELECTIVE_OPTION) as boolean;
  const requiredOptions = getRequiredOptions(formContext);
  const selectiveOptions = getSelectiveOptions(formContext);
  const productOptions = [];
  if (hasRequiredOption) productOptions.push(...requiredOptions);
  if (hasSelectiveOption) productOptions.push(...selectiveOptions);

  const isCustomProduct = watch(HAS_MANUFACTURING_LEAD_TIME) as boolean;
  const leadTimeMin = watch(LEAD_TIME_MIN) as string;
  const leadTimeMax = watch(LEAD_TIME_MAX) as string;
  const manufacturingLeadTime = {
    min: Number(leadTimeMin),
    max: Number(leadTimeMax),
  };

  const shipmentId = watch(SHIPMENT_TEMPLATE_ID) as string;
  const isBundleShipment = watch(IS_BUNDLE_SHIPMENT) as string;
  const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
  const shipmentPrice = watch(SHIPMENT_PRICE) as string;
  const shipmentDistantPrice = watch(SHIPMENT_DISTANT_PRICE) as string;
  const shipmentReturnPrice = watch(SHIPMENT_RETURN_PRICE) as string;
  const shipmentExchangePrice = watch(SHIPMENT_EXCHANGE_PRICE) as string;
  const specName = watch(SPEC_NAME) as string;
  const material = watch(MATERIAL) as string;
  const weight = watch(WEIGHT) as string;
  const size = watch(SIZE) as string;
  const manufacturer = watch(MANUFACTURER) as string;
  const precaution = watch(PRECAUTION) as string;
  const authorization = watch(AUTHORIZATION) as string;
  const personInCharge = watch(PERSON_IN_CHARGE) as string;

  const hasTagInfos = watch(HAS_TAG_INFOS) as boolean;

  return {
    name,
    categoryName: getCategoryName(formContext),
    uploadedFileInfos: combineProductFormImages(),
    description,
    colors: colors.map((color) => ({ name: color })),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    discountAmount: isDiscounted ? Number(discountAmount) : null,
    discountMethod: isDiscounted ? discountMethod : null,
    startDiscountDate: hasDiscountSpan ? new Date(startDiscountDate) : null,
    endDiscountDate: hasDiscountSpan ? new Date(endDiscountDate) : null,
    quantity: quantity ? Number(quantity) : null,
    optionCombinations:
      !hasRequiredOption && !hasSelectiveOption ? null : productOptions,
    manufacturingLeadTime: isCustomProduct ? manufacturingLeadTime : null,
    shipmentId: shipmentId ? Number(shipmentId) : null,
    isBundleShipment: shipmentId ? null : isBundleShipment === "가능",
    shipmentType: shipmentId ? null : shipmentType,
    shipmentPrice:
      shipmentId || shipmentPrice === null ? null : Number(shipmentPrice),
    shipmentDistantPrice:
      shipmentId || shipmentDistantPrice === null
        ? null
        : Number(shipmentDistantPrice),
    shipmentReturnPrice:
      shipmentId || shipmentReturnPrice === null
        ? null
        : Number(shipmentReturnPrice),
    shipmentExchangePrice:
      shipmentId || shipmentExchangePrice === null
        ? null
        : Number(shipmentExchangePrice),
    specName,
    material,
    weight,
    size,
    manufacturer,
    precaution,
    authorization,
    personInCharge,
    tagInfos: hasTagInfos ? getTagInfos() : null,
  };
}

function combineProductFormImages(): Array<UploadedFileInfos> {
  const requiredImages = requiredImagesVar().map(({ type, url }) => ({
    type,
    url,
  }));

  const optionalImages = optionalImagesVar().map(({ type, url }) => ({
    type,
    url,
  }));

  const descriptionImages = descriptionImagesVar().map(({ type, url }) => ({
    type,
    url,
  }));

  return [...requiredImages, ...optionalImages, ...descriptionImages].filter(
    (image) => image.url
  );
}

function getCategoryName(formContext: UseFormReturn): CategoryNames {
  const { getValues } = formContext;

  const categories: Array<CategoryNames> = getValues([
    CATEGORY_FIRST,
    CATEGORY_SECOND,
    CATEGORY_THIRD,
  ]);

  for (let i = 0; i < categories.length; i++) {
    const previousCategoryName: CategoryNames | undefined = categories[i - 1];
    const categoryName = categories[i];

    if (!categoryName) {
      if (!previousCategoryName) {
        return null;
      }

      return previousCategoryName;
    }
  }

  return last(categories);
}

function getRequiredOptions(formContext: UseFormReturn) {
  const { watch } = formContext;

  const { optionHeaders, optionRows } = requiredOptionVar().adaptedOption;

  const requiredOptions = optionRows.map(({ id, option }) => {
    const components = option.map((value, index) => ({
      name: optionHeaders[index].header,
      value,
    }));

    const optionStock = watch(`optionStock-${id}`) as number;
    const optionPrice = watch(`optionPrice-${id}`) as number;

    return {
      components,
      quantity: optionStock,
      price: optionPrice,
      isRequired: true,
    };
  });

  return requiredOptions;
}

function getSelectiveOptions(formContext: UseFormReturn) {
  const { watch } = formContext;

  const { optionHeaders, optionRows } = selectiveOptionVar().adaptedOption;

  const selectiveOptions = optionRows.map(({ id, option }) => {
    const components = option.map((value, index) => ({
      name: optionHeaders[index].header,
      value,
    }));

    const optionStock = watch(`optionStock-${id}`) as number;
    const optionPrice = watch(`optionPrice-${id}`) as number;

    return {
      components,
      quantity: optionStock,
      price: optionPrice,
      isRequired: false,
    };
  });

  return selectiveOptions;
}

function getTagInfos(): Array<{ name: string; isExposed: boolean }> {
  const tagList = tagListVar();

  const tagInfos = tagList.map(({ tagName, type }) => {
    return {
      name: tagName,
      isExposed: type === TagTypes.Exposed ? true : false,
    };
  });

  return tagInfos;
}

export function getDiscountedPrice(
  originalPrice: number,
  discountAmount: number,
  discountOption: string
): string {
  if (!discountAmount) {
    return "-";
  }

  if (discountOption === "PERCENT") {
    return String(originalPrice - originalPrice * discountAmount * 0.01);
  }

  if (discountOption === "WON") {
    return String(originalPrice - discountAmount);
  }

  return String(originalPrice);
}

export function resetForm(reset: UseFormReset<ProductFormValues>) {
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
