import { useQuery } from "@apollo/client";
import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  GET_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";
import { OrderStatus } from "@models/order";
import { NormalizedListType } from "@models/order/orderManagement";
import caculateOrderItem from "@utils/order/caculateOrderItem";
import contructOrderItem from "@utils/order/contructOrderItem";

export const useOrder = (orderStatus: OrderStatus) => {
  const { loading, data } = useQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    variables: { input: { status: orderStatus } },
  });

  const ok = data?.getOrdersBySeller.ok || false;
  const error = data?.getOrdersBySeller.error || null;

  const orderItem = data?.getOrdersBySeller.orderItems || [];
  const nomalizedOrderItem: NormalizedListType = contructOrderItem(orderItem);
  const caculatedOrderItem = caculateOrderItem(nomalizedOrderItem);

  return { loading, ok, error, caculatedOrderItem };
};
