import { useLazyQuery } from "@apollo/client";

import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
} from "@models/sale/order";

const useLazyOrders = () => {
  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetOrdersBySellerType,
    { input: GetOrdersBySellerInputType }
  >(GET_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrderItem, loading, error, data };
};
export default useLazyOrders;
