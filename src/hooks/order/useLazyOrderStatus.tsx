import { useLazyQuery } from "@apollo/client";

import { GET_ORDER_STATUS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetOrderStatusBySellerType,
  GetOrderStatusBySellerInputType,
} from "@models/sale/order";

const useLazyOrderStatus = () => {
  const [getOrderStatus, { loading, error, data }] = useLazyQuery<
    GetOrderStatusBySellerType,
    { input: GetOrderStatusBySellerInputType }
  >(GET_ORDER_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  return { loading, error, data, getOrderStatus };
};
export default useLazyOrderStatus;
