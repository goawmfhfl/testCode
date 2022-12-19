import { useLazyQuery } from "@apollo/client";

import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
} from "@models/sale/order";

const useLazyCancelOrders = () => {
  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrderItem, loading, error, data };
};
export default useLazyCancelOrders;
