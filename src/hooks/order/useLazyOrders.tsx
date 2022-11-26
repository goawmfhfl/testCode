import { useLazyQuery } from "@apollo/client";

import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  GET_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";

const useLazyOrders = () => {
  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrderItem, loading, error, data };
};
export default useLazyOrders;
