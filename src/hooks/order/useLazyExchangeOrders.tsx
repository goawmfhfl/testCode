import { useLazyQuery } from "@apollo/client";

import { GET_EXCHANGE_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetExchangeOrdersBySellerType,
  GetExchangeOrdersBySellerInputType,
} from "@models/sale/exchange";

const useLazyExchangeOrders = () => {
  const [getOrders, { loading, error, data }] = useLazyQuery<
    GetExchangeOrdersBySellerType,
    { input: GetExchangeOrdersBySellerInputType }
  >(GET_EXCHANGE_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrders, loading, error, data };
};
export default useLazyExchangeOrders;
