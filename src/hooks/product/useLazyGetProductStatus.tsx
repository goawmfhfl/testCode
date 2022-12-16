import { useLazyQuery } from "@apollo/client";

import {
  GetProductStatusBySellerInPutType,
  GetProductStatusBySellerType,
  GET_PRODCUCTS_STATUS_BY_SELLER,
} from "@graphql/queries/getProductsBySeller";

const useLazyGetProductStatus = () => {
  const [getProductStatus, { loading, error, data }] = useLazyQuery<
    GetProductStatusBySellerType,
    GetProductStatusBySellerInPutType
  >(GET_PRODCUCTS_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return {
    getProductStatus,
    loading,
    error,
    data,
  };
};
export default useLazyGetProductStatus;
