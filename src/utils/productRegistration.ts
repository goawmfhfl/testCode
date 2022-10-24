import { last } from "lodash";
import { UseFormReturn } from "react-hook-form";

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
  SHIPMENT_TEMPLATE,
  IS_BUNDLE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  RETURN_PRICE,
  EXCHANGE_PRICE,
  SPEC_NAME,
  MATERIAL,
  WEIGHT,
  SIZE,
  MANUFACTURER,
  PRECAUTION,
  AUTHORIZATION,
  PERSON_IN_CHARGE,
  HAS_TAG_INFOS,
} from "@cache/productRegistration";

import {
  requiredImagesVar,
  optionalImagesVar,
} from "@cache/productRegistration/productImages";

import {
  requiredOptionVar,
  selectiveOptionVar,
} from "@cache/productRegistration/productOptions";

import { shipmentTemplatesVar } from "@cache/productRegistration/shipmentTemplate";

import { tagListVar } from "@cache/productRegistration/searchTag";

import {
  CategoryName,
  ColorType,
  UploadedFileInfos,
} from "@models/productRegistration/index";

import { TagTypes } from "@models/productRegistration/searchTag";
import {
  ShipmentChargeType,
  CreateShipmentInputType,
} from "@models/productRegistration/shipmentTemplate";

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

  const shipmentTemplateName = watch(SHIPMENT_TEMPLATE) as string;
  const shipmentTemplate: CreateShipmentInputType = shipmentTemplatesVar().find(
    (template) => template.name === shipmentTemplateName
  );
  const shipmentId = shipmentTemplate?.id;
  const isBundleShipment = watch(IS_BUNDLE_SHIPMENT) as string;
  const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
  const shipmentPrice = watch(SHIPMENT_PRICE) as string;
  const shipmentDistantPrice = watch(SHIPMENT_DISTANT_PRICE) as string;
  const shipmentReturnPrice = watch(RETURN_PRICE) as string;
  const shipmentExchangePrice = watch(EXCHANGE_PRICE) as string;
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
    uploadedFileInfos: getPhotoInfos(),
    description,
    colors: colors.map((color) => ({ name: color })),
    originalPrice: Number(originalPrice),
    discountAmount: isDiscounted ? Number(discountAmount) : null,
    discountMethod: isDiscounted ? discountMethod : null,
    startDiscountDate: isDiscounted ? new Date(startDiscountDate) : null,
    endDiscountDate: isDiscounted ? new Date(endDiscountDate) : null,
    quantity: Number(quantity),
    optionCombinations:
      !hasRequiredOption && !hasSelectiveOption ? null : productOptions,
    manufacturingLeadTime: isCustomProduct ? manufacturingLeadTime : null,
    shipmentId,
    isBundleShipment: shipmentId ? null : isBundleShipment === "가능",
    shipmentType: shipmentId ? null : shipmentType,
    shipmentPrice: shipmentId ? null : Number(shipmentPrice),
    shipmentDistantPrice: shipmentId ? null : Number(shipmentDistantPrice),
    shipmentReturnPrice: shipmentId ? null : Number(shipmentReturnPrice),
    shipmentExchangePrice: shipmentId ? null : Number(shipmentExchangePrice),
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

function getPhotoInfos(): Array<UploadedFileInfos> {
  const requiredImages = [...requiredImagesVar()].map(({ type, url }) => ({
    type,
    url,
  }));

  const optionalImages = [...optionalImagesVar()].map(({ type, url }) => ({
    type,
    url,
  }));

  return [...requiredImages, ...optionalImages].filter((image) => image.url);
}

function getCategoryName(formContext: UseFormReturn): CategoryName {
  const { getValues } = formContext;

  const categories: Array<CategoryName> = getValues([
    CATEGORY_FIRST,
    CATEGORY_SECOND,
    CATEGORY_THIRD,
  ]);

  for (let i = 0; i < categories.length; i++) {
    const previousCategoryName: CategoryName | undefined = categories[i - 1];
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

  const requiredOptions = optionRows.map((row) => {
    const components = row.option.map((value, index) => ({
      name: optionHeaders[index].header,
      value,
    }));

    const optionStock = watch(`optionStock-${row.id}`) as string;
    const optionPrice = watch(`optionPrice-${row.id}`) as string;

    return {
      components,
      price: Number(optionPrice),
      quantity: Number(optionStock),
      isRequired: true,
    };
  });

  return requiredOptions;
}

function getSelectiveOptions(formContext: UseFormReturn) {
  const { watch } = formContext;

  const { optionRows } = selectiveOptionVar().adaptedOption;

  const selectiveOptions = optionRows.map(({ id, option }) => {
    const [name, value] = option;

    const optionStock = watch(`optionStock-${id}`) as string;
    const optionPrice = watch(`optionPrice-${id}`) as string;

    return {
      components: [{ name, value }],
      price: Number(optionPrice),
      quantity: Number(optionStock),
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
