import { useLazyQuery } from "@apollo/client";

import {
  GetOrderStatusBySellerType,
  GetOrderStatusBySellerInputType,
  GET_ORDER_STATUS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";

const useLazyOrderStatus = () => {
  const [getOrderStatus, { loading, error, data }] = useLazyQuery<
    GetOrderStatusBySellerType,
    { input: GetOrderStatusBySellerInputType }
  >(GET_ORDER_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { loading, error, data, getOrderStatus };
};
export default useLazyOrderStatus;
