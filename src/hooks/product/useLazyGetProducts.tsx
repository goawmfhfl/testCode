import { useLazyQuery } from "@apollo/client";

import {
  GetProductsBySellerInputType,
  GetProductsBySellerType,
  GET_PRODUCTS_BY_SELLER,
} from "@graphql/queries/getProductsBySeller";

const useLazyGetProducts = () => {
  const [getProducts, { loading, error, data }] = useLazyQuery<
    GetProductsBySellerType,
    GetProductsBySellerInputType
  >(GET_PRODUCTS_BY_SELLER, {
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
export default useLazyGetProducts;
