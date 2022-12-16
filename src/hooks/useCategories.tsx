import { useQuery } from "@apollo/client";

import {
  GetCategoriesType,
  GET_CATEGORIES,
} from "@graphql/queries/getCategoreis";

const useCategories = () => {
  const { loading, error, data } = useQuery<GetCategoriesType>(
    GET_CATEGORIES,

    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  return { loading, error, data };
};

export default useCategories;
