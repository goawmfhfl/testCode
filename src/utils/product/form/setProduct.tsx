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
} from "@cache/productForm";
import { UploadFileType } from "@models/index";
import {
  optionalImagesVar,
  requiredImagesVar,
} from "@cache/productForm/productImages";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";

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
    uploadedFileUrls,
  } = product;

  const isSetDiscountSpan = startDiscountDate && endDiscountDate;

  reset({
    TITLE: name,
    PRODUCT_DESCRIPTION: description,
    PRODUCT_COLOR: colors.map(({ name }) => name),
    PRODUCT_PRICE: originalPrice,
    IS_DISCOUNTED: !!discountAmount,
    DISCOUNT_AMOUNT: discountAmount,
    DISCOUNT_OPTION: discountMethod,
    HAS_DISCOUNT_SPAN: !!isSetDiscountSpan,
    DISCOUNT_STARTS_AT: new Date(startDiscountDate),
    DISCOUNT_ENDS_AT: new Date(endDiscountDate),
    PRODUCT_STOCK: quantity,
  });

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

    console.log(requiredImages);

    if (requiredImages.length) {
      const newRequiredImages = [...requiredImagesVar()];

      newRequiredImages[0].url = thumbnail.url;
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

  // TODO: 옵션 (필수, 추가)
  // TODO: 제작기간
  // TODO: 배송정보
  // TODO: 스펙 (무게, 크기, ..)
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
