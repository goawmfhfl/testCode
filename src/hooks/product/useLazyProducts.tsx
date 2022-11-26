import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyProducts = () => {
  const [getProducts, { loading, error, data }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return {
    loading,
    error,
    data,
    getProducts,
  };
};
export default useLazyProducts;
