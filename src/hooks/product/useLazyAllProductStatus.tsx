import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsStatusBySellerInPutType,
  GetAllProductsStatusBySellerType,
  GET_ALL_PRODCUCTS_STATUS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyAllProductStatus = () => {
  const [getAllProductsStatus, { loading, error, data }] = useLazyQuery<
    GetAllProductsStatusBySellerType,
    GetAllProductsStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return {
    getAllProductsStatus,
    loading,
    error,
    data,
  };
};
export default useLazyAllProductStatus;
