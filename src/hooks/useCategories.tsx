import { useQuery } from "@apollo/client";

import {
  GetAllCategoriesType,
  GET_ALL_CATEGORIES,
} from "@graphql/queries/getAllCategoreis";

const useCategories = () => {
  const { loading, error, data } = useQuery<GetAllCategoriesType>(
    GET_ALL_CATEGORIES,

    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  return { loading, error, data };
};

export default useCategories;
