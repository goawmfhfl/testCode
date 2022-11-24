import { useEffect } from "react";
import { makeVar, useLazyQuery, useReactiveVar } from "@apollo/client";

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
  const totalOrderItemsVar = makeVar<Array<caculatedOrderItemType>>([]);
  const totalOrderItems = useReactiveVar(totalOrderItemsVar);

  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    variables: { input },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const orderItems = data?.getOrdersBySeller.totalOrderItems || [];
  const nomalizedOrderItem: NormalizedListType = contructOrderItem(orderItems);
  const caculatedOrderItem: Array<caculatedOrderItemType> =
    caculateOrderItem(nomalizedOrderItem);

  useEffect(() => {
    totalOrderItemsVar(caculatedOrderItem);
  }, [data]);

  return { loading, error, totalOrderItems, totalOrderItemsVar, getOrderItem };
};
export default useLazyOrders;
