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
import {
  checkedProductIdsVar,
  checkAllBoxStatusVar,
  pageNumberListVar,
} from "@cache/index";

const useLazyOrders = () => {
  const totalOrderItemsVar = makeVar<Array<caculatedOrderItemType>>([]);
  const totalOrderItems = useReactiveVar(totalOrderItemsVar);

  const [getOrderItem, { loading, error, data }] = useLazyQuery<
    GetOrdersBySellerType,
    GetOrdersBySellerInputType
  >(GET_ORDERS_BY_SELLER, {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  useEffect(() => {
    const totalPages: number = data?.getOrdersBySeller.totalPages;
    const orderItems = data?.getOrdersBySeller.totalOrderItems || [];
    const nomalizedOrderItem: NormalizedListType =
      contructOrderItem(orderItems);
    const caculatedOrderItem: Array<caculatedOrderItemType> =
      caculateOrderItem(nomalizedOrderItem);

    if (totalPages) {
      pageNumberListVar(
        Array(totalPages)
          .fill(null)
          .map((_, index) => index + 1)
      );
    }

    totalOrderItemsVar(caculatedOrderItem);
    checkedProductIdsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  return { loading, error, totalOrderItems, totalOrderItemsVar, getOrderItem };
};
export default useLazyOrders;
