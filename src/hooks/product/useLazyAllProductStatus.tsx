import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductStatusBySellerInPutType,
  GetAllProductStatusBySellerType,
  GET_ALL_PRODCUCTS_STATUS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

const useLazyAllProductStatus = () => {
  const [getAllProductStatus, { loading, error, data }] = useLazyQuery<
    GetAllProductStatusBySellerType,
    GetAllProductStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return {
    getAllProductStatus,
    loading,
    error,
    data,
  };
};
export default useLazyAllProductStatus;
