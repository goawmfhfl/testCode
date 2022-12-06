import { v4 as uuidv4 } from "uuid";
import { UseFormReset, UseFormSetValue } from "react-hook-form";

import {
  ProductFormValues,
  ProductType,
  ProductCategory,
} from "@models/product";

import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
  HAS_MANUFACTURING_LEAD_TIME,
  LEAD_TIME_MIN,
  LEAD_TIME_MAX,
  HAS_REQUIRED_OPTION,
  HAS_SELECTIVE_OPTION,
} from "@cache/productForm";
import { UploadFileType } from "@models/index";
import {
  optionalImagesVar,
  requiredImagesVar,
} from "@cache/productForm/productImages";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import {
  requiredOptionVar,
  selectiveOptionVar,
} from "@cache/productForm/productOptions";
import { restructureOptions } from "./options";

const setProduct = (
  product: ProductType,
  reset: UseFormReset<ProductFormValues>,
  setValue: UseFormSetValue<ProductFormValues>
) => {
  const {
    name,
    description,
    category,
    colors,
    originalPrice,
    discountAmount,
    discountMethod,
    startDiscountDate,
    endDiscountDate,
    quantity,
    options,
    uploadedFileUrls,
    manufacturingLeadTime,
    shipment,
    isBundleShipment,
    shipmentType,
    shipmentPrice,
    shipmentDistantPrice,
    shipmentReturnPrice,
    shipmentExchangePrice,
    specName,
    material,
    weight,
    size,
    manufacturer,
    precaution,
    authorization,
    personInCharge,
  } = product;

  const isSetDiscountSpan = startDiscountDate || endDiscountDate;

  reset({
    TITLE: name,
    PRODUCT_DESCRIPTION: description,
    PRODUCT_COLOR: colors.map(({ name }) => name),
    PRODUCT_PRICE: originalPrice,
    IS_DISCOUNTED: !!discountAmount,
    DISCOUNT_AMOUNT: discountAmount,
    DISCOUNT_OPTION: discountMethod,
    HAS_DISCOUNT_SPAN: !!isSetDiscountSpan,
    DISCOUNT_STARTS_AT: startDiscountDate ? new Date(startDiscountDate) : null,
    DISCOUNT_ENDS_AT: endDiscountDate ? new Date(endDiscountDate) : null,
    PRODUCT_STOCK: quantity,
    IS_BUNDLE_SHIPMENT: isBundleShipment ? "가능" : "불가능",
    SHIPMENT_TEMPLATE_ID: shipment.id ? Number(shipment.id) : null,
    SHIPMENT_PRICE_TYPE: shipmentType,
    SHIPMENT_PRICE: shipmentPrice,
    SHIPMENT_DISTANT_PRICE: shipmentDistantPrice,
    SHIPMENT_RETURN_PRICE: shipmentReturnPrice,
    SHIPMENT_EXCHANGE_PRICE: shipmentExchangePrice,
    SPEC_NAME: specName,
    MATERIAL: material,
    SIZE: weight,
    WEIGHT: size,
    MANUFACTURER: manufacturer,
    PRECAUTION: precaution,
    AUTHORIZATION: authorization,
    PERSON_IN_CHARGE: personInCharge,
  });

  if (options && options.length) {
    const requiredOptions = options.filter((ops) => ops.isRequired);

    if (requiredOptions.length) {
      setValue(HAS_REQUIRED_OPTION, true);

      const { optionInputList, adaptedOption } =
        restructureOptions(requiredOptions);

      requiredOptionVar({
        optionInputList,
        adaptedOption,
      });

      optionInputList.forEach(({ id: optionInputId }, index) => {
        const optionName = adaptedOption.optionHeaders[index].header;

        const optionValue = [
          ...new Set(
            adaptedOption.optionRows.map(({ option }) => option[index])
          ),
        ].join(", ");

        setValue(`requiredOptionName-${optionInputId}`, optionName);
        setValue(`requiredOptionValue-${optionInputId}`, optionValue);
      });

      adaptedOption.optionRows.forEach((row) => {
        setValue(`optionStock-${row.id}`, row.stock);
        setValue(`optionPrice-${row.id}`, row.price);
      });
    }

    const selectiveOptions = options.filter((ops) => !ops.isRequired);

    if (selectiveOptions.length) {
      setValue(HAS_SELECTIVE_OPTION, true);

      const { optionInputList, adaptedOption } =
        restructureOptions(selectiveOptions);

      selectiveOptionVar({
        optionInputList,
        adaptedOption,
      });

      optionInputList.forEach(({ id }, index) => {
        const optionName = adaptedOption.optionHeaders[index].header;

        const optionValue = [
          ...new Set(
            adaptedOption.optionRows.map(({ option }) => option[index])
          ),
        ].join(", ");

        setValue(`selectiveOptionName-${id}`, optionName);
        setValue(`selectiveOptionValue-${id}`, optionValue);
      });

      adaptedOption.optionRows.forEach((row) => {
        setValue(`optionStock-${row.id}`, row.stock);
        setValue(`optionPrice-${row.id}`, row.price);
      });
    }
  }

  if (manufacturingLeadTime) {
    setValue(HAS_MANUFACTURING_LEAD_TIME, true);
    setValue(LEAD_TIME_MIN, manufacturingLeadTime.min);
    setValue(LEAD_TIME_MAX, manufacturingLeadTime.max);
  }

  if (category) {
    const categoryLength = getCategoryLength(category);

    const { firstCategory, secondCategory, thirdCategory } = evaluateCategory(
      product.category,
      categoryLength
    );

    setValue(CATEGORY_FIRST, firstCategory);
    setValue(CATEGORY_SECOND, secondCategory);
    setValue(CATEGORY_THIRD, thirdCategory);
  }

  if (uploadedFileUrls && uploadedFileUrls.length) {
    const thumbnail = uploadedFileUrls.find(
      (uploadedFile) => uploadedFile.type === UploadFileType.PRODUCT_THUMBNAIL
    );
    const requiredImages = uploadedFileUrls.filter(
      (uploadedFile) => uploadedFile.type === UploadFileType.PRODUCT_REQUIRED
    );
    const optionalImages = uploadedFileUrls.filter(
      (uploadedFile) => uploadedFile.type === UploadFileType.PRODUCT_OPTIONAL
    );
    const descriptionImages = uploadedFileUrls.filter(
      (uploadedFile) => uploadedFile.type === UploadFileType.PRODUCT_DETAIL_PAGE
    );

    if (requiredImages.length) {
      const newRequiredImages = [...requiredImagesVar()];

      newRequiredImages[0].url = thumbnail?.url || "";
      newRequiredImages[1].url = requiredImages[0]?.url || "";
      newRequiredImages[2].url = requiredImages[1]?.url || "";
      newRequiredImages[3].url = requiredImages[2]?.url || "";
      newRequiredImages[4].url = requiredImages[3]?.url || "";

      requiredImagesVar(newRequiredImages);
    }

    if (optionalImages.length) {
      optionalImagesVar(
        optionalImages.map(({ type, url }) => ({
          id: uuidv4(),
          type,
          url,
        }))
      );
    }

    if (descriptionImages.length) {
      descriptionImagesVar(
        descriptionImages.map(({ type, url }) => ({
          id: uuidv4(),
          type,
          url,
          size: 1024 * 1024 * 5, // TODO: 서버에서 값을 가져와야 함
        }))
      );
    }
  }

  // TODO: 태그
};

const evaluateCategory = (() => {
  const result = {
    count: 0,
    firstCategory: null,
    secondCategory: null,
    thirdCategory: null,
  };

  return (
    category: ProductCategory,
    categoryLength: number
  ): {
    count: number;
    firstCategory: null | string;
    secondCategory: null | string;
    thirdCategory: null | string;
  } => {
    result.count++;

    if (result.count === categoryLength - 2) {
      result.thirdCategory = category.name;
    }

    if (result.count === categoryLength - 1) {
      result.secondCategory = category.name;
    }

    if (!category.parent) {
      result.firstCategory = category.name;

      return;
    }

    evaluateCategory(category.parent, categoryLength);

    return result;
  };
})();

const getCategoryLength = (() => {
  let categoryLength = 0;

  return (category: ProductCategory): number => {
    categoryLength++;

    if (!category.parent) {
      return;
    }

    getCategoryLength(category.parent);

    return categoryLength;
  };
})();

export default setProduct;
