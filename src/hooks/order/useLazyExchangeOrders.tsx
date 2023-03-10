import { useLazyQuery } from "@apollo/client";
import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";

import { GET_EXCHANGE_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetExchangeOrdersBySellerType,
  GetExchangeOrdersBySellerInputType,
} from "@models/sale/exchange";

const useLazyExchangeOrders = () => {
  const [getOrderItems, { loading, error, data }] = useLazyQuery<
    GetExchangeOrdersBySellerType,
    { input: GetExchangeOrdersBySellerInputType }
  >(GET_EXCHANGE_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  return { getOrderItems, loading, error, data };
};
export default useLazyExchangeOrders;
