import {
  OptionCombination,
  ProductInput,
  ProductOutput,
} from "@models/product";
import { isEqual } from "lodash";
import { CategoriesType } from "@models/index";

const keysToBeIgnored = ["__typename", "createdAt", "updatedAt", "status"];

const keyMapper = {
  category: "categoryName",
  options: "optionCombinations",
  productToTags: "tagInfos",
  uploadedFileUrls: "uploadedFileInfos",
};

const compareProduct = (modified: ProductInput, original: ProductOutput) => {
  const result = Object.keys(original).reduce((result, key) => {
    if (keysToBeIgnored.includes(key)) return result;

    const originalValue = original[key] as unknown;
    const modifiedValue = Object.keys(keyMapper).includes(key)
      ? (modified[keyMapper[key] as string] as unknown)
      : (modified[key] as unknown);

    if (
      key === "colors" &&
      originalValue instanceof Array &&
      modifiedValue instanceof Array
    ) {
      const isEqualColors = isEqual(
        originalValue.map(({ name }) => name as string),
        modifiedValue.map(({ name }) => name as string)
      );

      if (!isEqualColors) {
        result.push(key);
      }

      return result;
    }

    if (
      key === "options" &&
      originalValue instanceof Array &&
      modifiedValue instanceof Array
    ) {
      const originalOptions = originalValue as Array<OptionCombination>;

      const isEqualOptions = isEqual(
        originalOptions.map(
          ({ components, index, isRequired, price, quantity }) => ({
            components: components.map(({ name, value }) => ({
              name,
              value,
            })),
            index,
            isRequired,
            price,
            quantity,
          })
        ),
        modifiedValue
      );

      if (!isEqualOptions) {
        result.push(key);
      }

      return result;
    }

    if (key === "shipment") return result;

    if (
      key === "category" &&
      (originalValue != null || typeof modifiedValue === "string")
    ) {
      const originalCateogry = (originalValue as CategoriesType) || null;

      const isEqualCategory = isEqual(originalCateogry?.name, modifiedValue);

      if (!isEqualCategory) {
        result.push(key);
      }

      return result;
    }

    if (
      key === "productToTags" &&
      originalValue instanceof Array &&
      modifiedValue instanceof Array
    ) {
      const isEqualTags = isEqual(
        originalValue.map(({ index, isExposed, tag: { name } }) => ({
          index: index as number,
          name: name as string,
          isExposed: isExposed as boolean,
        })),
        modifiedValue
      );

      if (!isEqualTags) {
        result.push(key);
      }

      return result;
    }

    if (
      key === "uploadedFileUrls" &&
      originalValue instanceof Array &&
      modifiedValue instanceof Array
    ) {
      const hasSameLength = originalValue.length === modifiedValue.length;
      const isEqualUrls = isEqual(
        originalValue.map(({ url }) => url as string),
        modifiedValue.map(({ url }) => url as string)
      );

      if (!hasSameLength || !isEqualUrls) {
        result.push(key);
      }

      return result;
    }

    if (!isEqual(originalValue, modifiedValue)) {
      result.push(key);
    }

    return result;
  }, [] as Array<string>);

  return result;
};

export default compareProduct;
