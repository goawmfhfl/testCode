import { CategoriesType, CategoryType, CategoryName } from "@models/index";

const contructCategories = (categories: Array<CategoriesType>) => {
  const firstCategoriesInitialValue: Array<CategoryName> = [];
  const secondCategoriesInitialValue: {
    [key: string]: Array<CategoryName>;
  } = {};

  const thirdCategoriesInitialValue: Array<{
    [key: string]: Array<CategoryName>;
  }> = [];

  const firstCategories: Array<CategoryName> = categories.reduce((acc, cur) => {
    if (cur.parent === null && cur.type === CategoryType.NORMAL) {
      acc.push(cur.name);
    }
    return acc;
  }, firstCategoriesInitialValue);

  const secondCategories = firstCategories.reduce((acc, cur) => {
    const foundCategory: CategoriesType = categories.find(
      (category) => category.name === cur
    );
    if (foundCategory.type === CategoryType.NORMAL && !foundCategory.parent) {
      acc[cur] = foundCategory.children.map((category) => category.name);
    }
    return acc;
  }, secondCategoriesInitialValue);

  const secondCategoryValues = Object.values(secondCategories);
  const mergedSecondCategoryValues = secondCategoryValues.reduce((acc, cur) => {
    acc.push(...cur);

    return acc;
  }, []);

  const thirdCategories = mergedSecondCategoryValues.reduce((acc, cur) => {
    const foundCategory: CategoriesType = categories.find(
      (category) => category.name === cur
    );

    if (foundCategory.type === CategoryType.NORMAL) {
      acc[cur] = foundCategory.children.map((category) => category.name);
    }

    return acc;
  }, thirdCategoriesInitialValue);

  return { firstCategories, secondCategories, thirdCategories };
};

export default contructCategories;
