import { last } from "lodash";
import { UseFormReturn } from "react-hook-form";
import {
  requiredImagesVar,
  optionalImagesVar,
} from "@cache/productForm/productImages";
import {
  requiredOptionVar,
  selectiveOptionVar,
} from "@cache/productForm/productOptions";
import { tagListVar } from "@cache/productForm/searchTag";

import { UploadedFileInfos } from "@models/product/index";
import { TagTypes } from "@models/product/searchTag";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import { CategoryNames } from "@constants/category";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
} from "@cache/productForm";

export function combineProductFormImages(): Array<UploadedFileInfos> {
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

export function getCategoryName(formContext: UseFormReturn): CategoryNames {
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

export function getRequiredOptions(formContext: UseFormReturn) {
  const { watch } = formContext;

  const { optionHeaders, optionRows } = requiredOptionVar().adaptedOption;

  const requiredOptions = optionRows.map(({ id, option }, index) => {
    const components = option.map((value, index) => ({
      name: optionHeaders[index].header,
      value,
    }));

    const optionStock = watch(`optionStock-${id}`) as number;
    const optionPrice = watch(`optionPrice-${id}`) as number;

    return {
      index,
      components,
      quantity: optionStock,
      price: optionPrice,
      isRequired: true,
    };
  });

  return requiredOptions;
}

export function getSelectiveOptions(formContext: UseFormReturn) {
  const { watch } = formContext;

  const { optionRows } = selectiveOptionVar().adaptedOption;

  const selectiveOptions = optionRows.map(({ id, option }, index) => {
    const [name, value] = option;

    const components = {
      name,
      value,
    };

    const optionStock = watch(`optionStock-${id}`) as number;
    const optionPrice = watch(`optionPrice-${id}`) as number;

    return {
      index,
      components,
      quantity: optionStock,
      price: optionPrice,
      isRequired: false,
    };
  });

  return selectiveOptions;
}

export function getTagInfos(): Array<{ name: string; isExposed: boolean }> {
  const tagList = tagListVar();

  const tagInfos = tagList.map(({ tagName, type }, index) => {
    return {
      index,
      name: tagName,
      isExposed: type === TagTypes.Exposed ? true : false,
    };
  });

  return tagInfos;
}
