import { useQuery } from "@apollo/client";
import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  GET_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";
import { OrderStatus } from "@models/order";
import { contructOrderItem } from "@utils/order/contructOrderItem";

export const useOrder = (orderStatus: OrderStatus) => {
  const { loading, data } = useQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    variables: {
      input: {
        status: orderStatus,
      },
    },
  });

  const ok = data?.getOrdersBySeller.ok || false;
  const error = data?.getOrdersBySeller.error || null;
  const orderItem = data?.getOrdersBySeller.orderItems || [];

  const recontructOrderItem = contructOrderItem(orderItem);
  console.log("recontructOrderItem", recontructOrderItem);

  // const orderItem = caculateOrderItem(reContructOrderItem);

  return { loading, ok, error, orderItem };
};
