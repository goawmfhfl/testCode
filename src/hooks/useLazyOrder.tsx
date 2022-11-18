import { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  GET_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";

import { OrderStatus } from "@models/order";
import {
  NormalizedListType,
  caculatedOrderItemType,
} from "@models/order/orderManagement";

import caculateOrderItem from "@utils/order/caculateOrderItem";
import contructOrderItem from "@utils/order/contructOrderItem";

const useLazyOrder = (orderStatus: OrderStatus) => {
  const [orderItems, setOrderItems] = useState<Array<caculatedOrderItemType>>(
    []
  );

  const [getOrderItem, { loading, error }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    variables: { input: { status: orderStatus } },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const orderItems = data.getOrdersBySeller.orderItems;

      const nomalizedOrderItem: NormalizedListType =
        contructOrderItem(orderItems);

      const caculatedOrderItem: Array<caculatedOrderItemType> =
        caculateOrderItem(nomalizedOrderItem);

      setOrderItems(caculatedOrderItem);
    },
  });

  return { loading, error, orderItems, getOrderItem };
};
export default useLazyOrder;
