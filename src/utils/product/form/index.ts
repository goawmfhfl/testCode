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

import { OptionCombination, UploadedFileInfos } from "@models/product/index";
import { TagTypes } from "@models/product/searchTag";
import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import { CategoryNames } from "@constants/category";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
  serversideProductVar,
} from "@cache/productForm";
import { isBase64Url } from "@utils/index";
import { addImageOnServer, removeImageFromServer } from "@utils/index";

export async function combineProductFormImages(): Promise<
  Array<UploadedFileInfos>
> {
  const requiredImages = requiredImagesVar().map(
    ({ type, filename, file, url }) => ({
      type,
      filename,
      file,
      url,
    })
  );

  const optionalImages = optionalImagesVar().map(
    ({ type, filename, file, url }) => ({
      type,
      filename,
      file,
      url,
    })
  );

  const descriptionImages = descriptionImagesVar().map(
    ({ type, filename, file, url }) => ({
      type,
      filename,
      file,
      url,
    })
  );

  const combinedImages = [
    ...requiredImages,
    ...optionalImages,
    ...descriptionImages,
  ].filter((image) => image.url);

  const serversideImages = serversideProductVar().uploadedFileUrls;

  if (serversideImages) {
    const removedImagesFromClientSide = serversideImages.filter(
      (serversideImage) => {
        const hasRemovedByClientSide = !combinedImages.find(
          (clientsideImage) => clientsideImage.url === serversideImage.url
        );

        return hasRemovedByClientSide;
      }
    );

    await removeImageFromServer(removedImagesFromClientSide);
  }

  const imagesNotRegistered = combinedImages.filter((img) => {
    const isRegistered = !isBase64Url(img.url);

    if (isRegistered) return false;

    return true;
  });

  const registeredUrls = await addImageOnServer(
    imagesNotRegistered.map(({ file }) => {
      return file;
    })
  );

  const registeredCombinedImages = combinedImages.map((img) => {
    if (isBase64Url(img.url)) {
      const registeredImage = registeredUrls.shift();

      return {
        ...img,
        url: registeredImage.url,
      };
    }

    return img;
  });

  return registeredCombinedImages.map(({ type, url, file }) => ({
    type,
    url,
    size: file ? String(file.size) : null,
  }));
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

export function getRequiredOptions(
  formContext: UseFormReturn
): Array<OptionCombination> {
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

export function getSelectiveOptions(
  formContext: UseFormReturn
): Array<OptionCombination> {
  const { watch } = formContext;

  const { optionRows } = selectiveOptionVar().adaptedOption;

  const selectiveOptions = optionRows.map(({ id, option }, index) => {
    const [name, value] = option;

    const components = [
      {
        name,
        value,
      },
    ];

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
