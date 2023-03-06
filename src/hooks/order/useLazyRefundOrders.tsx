import { useLazyQuery } from "@apollo/client";

import { GET_REFUND_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import {
  GetRefundOrdersBySellerType,
  GetRefundOrdersBySellerInputType,
} from "@models/sale/refund";

const useLazyRefundOrders = () => {
  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetRefundOrdersBySellerType,
    { input: GetRefundOrdersBySellerInputType }
  >(GET_REFUND_ORDERS_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  return { getOrderItem, loading, error, data };
};
export default useLazyRefundOrders;
