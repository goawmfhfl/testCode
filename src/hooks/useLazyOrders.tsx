import { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import {
  GetOrdersBySellerInputType,
  GetOrdersBySellerType,
  GET_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";

import {
  NormalizedListType,
  caculatedOrderItemType,
} from "@models/order/orderManagement";

import caculateOrderItem from "@utils/order/caculateOrderItem";
import contructOrderItem from "@utils/order/contructOrderItem";

import { FilterOptionVarType } from "@models/order/orderManagement";

const useLazyOrders = (input: FilterOptionVarType) => {
  const [totalOrderItems, setTotalOrderItems] = useState<
    Array<caculatedOrderItemType>
  >([]);

  const [getOrderItem, { loading, error }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    variables: { input },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const totalOrderItems = data.getOrdersBySeller.totalOrderItems;

      const nomalizedOrderItem: NormalizedListType =
        contructOrderItem(totalOrderItems);

      const caculatedOrderItem: Array<caculatedOrderItemType> =
        caculateOrderItem(nomalizedOrderItem);

      setTotalOrderItems(caculatedOrderItem);
    },
  });

  return { loading, error, totalOrderItems, getOrderItem };
};
export default useLazyOrders;
