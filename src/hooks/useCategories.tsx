import { useState } from "react";
import { useQuery } from "@apollo/client";

import {
  GetAllCategoriesType,
  GET_ALL_CATEGORIES,
} from "@graphql/queries/getAllCategoreis";

import contructCategories from "@utils/contructCategories";
import { CategoriesType, CategoryName } from "@models/index";

const useCategories = () => {
  const [categories, setCategories] =
    useState<{
      firstCategories: Array<CategoryName>;
      secondCategories: {
        [key: string]: Array<CategoryName>;
      };
      thirdCategories: {
        [key: string]: Array<CategoryName>;
      }[];
    }>();

  const { loading, error, data } = useQuery<GetAllCategoriesType>(
    GET_ALL_CATEGORIES,

    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      errorPolicy: "all",

      onCompleted: (data) => {
        const categories: Array<CategoriesType> =
          data.getAllCategories.categories;

        const recontructCategories = contructCategories(categories);
        setCategories(recontructCategories);
      },
    }
  );

  return { loading, error, categories };
};

export default useCategories;
