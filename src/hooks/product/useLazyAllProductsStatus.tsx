import { useLazyQuery } from "@apollo/client";

import {
  GetAllProductsStatusBySellerInPutType,
  GetAllProductsStatusBySellerType,
  GET_ALL_PRODCUCTS_STATUS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";

import { ProductStatus } from "@constants/product";

const useLazyAllProductsStatus = () => {
  const [getAllProductsStatus, { loading, error, data }] = useLazyQuery<
    GetAllProductsStatusBySellerType,
    GetAllProductsStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: 20,
        status: null,
        query: null,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const products = data?.getAllProductsBySeller.products || [];

  const allProductsLength = products.length;

  const onSaleLength = products.filter(
    (list) => list.status === ProductStatus.ON_SALE
  ).length;

  const soldOutLength = products.filter(
    (list) => list.status === ProductStatus.SOLD_OUT
  ).length;

  const stopSaleLength = products.filter(
    (list) => list.status === ProductStatus.STOP_SALE
  ).length;

  return {
    loading,
    error,
    getAllProductsStatus,
    allProductsLength,
    onSaleLength,
    soldOutLength,
    stopSaleLength,
  };
};
export default useLazyAllProductsStatus;
