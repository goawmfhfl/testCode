import { useLazyQuery } from "@apollo/client";

import { GET_CANCEL_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetCancelOrdersBySellerType,
  GetCancelOrdersBySellerInputType,
} from "@models/sale/cancel";

const useLazyCancelOrders = () => {
  const [getOrders, { loading, error, data }] = useLazyQuery<
    GetCancelOrdersBySellerType,
    { input: GetCancelOrdersBySellerInputType }
  >(GET_CANCEL_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrders, loading, error, data };
};
export default useLazyCancelOrders;
