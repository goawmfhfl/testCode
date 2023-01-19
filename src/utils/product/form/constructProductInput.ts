import { UseFormReturn } from "react-hook-form";
import {
  TITLE,
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
  IS_B_MARKET_PRODUCT,
} from "@cache/productForm";

import { ColorType, OptionCombination, ProductInput } from "@models/product";
import { ShipmentChargeType } from "@models/product/shipmentTemplate";
import { DiscountMethod } from "@models/product";

import {
  getRequiredOptions,
  getSelectiveOptions,
  getCategoryName,
  combineProductFormImages,
  getTagInfos,
} from "@utils/product/form/index";

export default function constructProductInput(
  formContext: UseFormReturn
): ProductInput {
  const { watch } = formContext;

  const name = watch(TITLE) as string;
  const isBmarket = watch(IS_B_MARKET_PRODUCT) as boolean;
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

  const productOptions = [] as Array<OptionCombination>;
  if (hasRequiredOption) productOptions.push(...requiredOptions);
  if (hasSelectiveOption) productOptions.push(...selectiveOptions);

  const isCustomProduct = watch(HAS_MANUFACTURING_LEAD_TIME) as boolean;
  const leadTimeMin = watch(LEAD_TIME_MIN) as string;
  const leadTimeMax = watch(LEAD_TIME_MAX) as string;
  const manufacturingLeadTime = {
    min: Number(leadTimeMin),
    max: Number(leadTimeMax),
  };

  const shipmentId = watch(SHIPMENT_TEMPLATE_ID) as number;
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
    isBmarket,
    categoryName: getCategoryName(formContext),
    description,
    uploadedFileInfos: combineProductFormImages(),
    colors: colors.map((color) => ({ name: color })),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    discountAmount: isDiscounted ? Number(discountAmount) : null,
    discountMethod: discountMethod ? discountMethod : DiscountMethod.PERCENT,
    startDiscountDate:
      isDiscounted && hasDiscountSpan && startDiscountDate
        ? new Date(startDiscountDate)
        : null,
    endDiscountDate:
      isDiscounted && hasDiscountSpan && endDiscountDate
        ? new Date(endDiscountDate)
        : null,
    quantity: quantity ? Number(quantity) : null,

    isSelectiveOptionInUse: hasSelectiveOption,
    optionCombinations: productOptions,
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
