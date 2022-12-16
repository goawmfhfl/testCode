import { useLazyQuery } from "@apollo/client";

import {
  GetAllOrderStatusBySellerType,
  GetAllOrderStatusBySellerInputType,
  GET_ALL_ORDER_STATUS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";

const useLazyAllOrderStatus = () => {
  const [getAllOrderStatus, { loading, error, data }] = useLazyQuery<
    GetAllOrderStatusBySellerType,
    { input: GetAllOrderStatusBySellerInputType }
  >(GET_ALL_ORDER_STATUS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { loading, error, data, getAllOrderStatus };
};
export default useLazyAllOrderStatus;
