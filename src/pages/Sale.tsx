import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "react-router-dom";

import { SaleMenuStatusType } from "@constants/sale";
import { decryptSaleStatusId } from "@constants/index";
import { orderStatusGroupVar } from "@cache/sale";

import { GET_ORDER_STATUS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

import useAuthGuard from "@hooks/useAuthGuard";

import {
  GetOrderStatusBySellerType,
  GetOrderStatusBySellerInputType,
} from "@models/sale/order";

import Layout from "@components/common/Layout";
import OrderManagement from "@components/sale/orderManagement";
import CancelManagement from "@components/sale/cancelManagement";
import RefundManagement from "@components/sale/refundManagement";
import ExchangeMananagement from "@components/sale/exchangeManagement";

const Sale = () => {
  const { data } = useQuery<
    GetOrderStatusBySellerType,
    { input: GetOrderStatusBySellerInputType }
  >(GET_ORDER_STATUS_BY_SELLER, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    variables: {
      input: {
        page: 1,
      },
    },
  });

  const [searchParams] = useSearchParams();
  const menuStatus = searchParams.get("statusId");

  useAuthGuard();

  useEffect(() => {
    const hasData = !!data && !!data.getOrdersBySeller;

    if (!hasData) return;

    const {
      getOrdersBySeller: { totalOrderItems },
    } = data;

    const orderStatusGroup = totalOrderItems.map(
      ({ orderStatusGroup }) => orderStatusGroup
    );

    orderStatusGroupVar(orderStatusGroup);
  }, [data]);

  return (
    <Layout>
      {decryptSaleStatusId[menuStatus] === SaleMenuStatusType.ORDER && (
        <OrderManagement />
      )}
      {decryptSaleStatusId[menuStatus] === SaleMenuStatusType.CANCEL && (
        <CancelManagement />
      )}
      {decryptSaleStatusId[menuStatus] === SaleMenuStatusType.REFUND && (
        <RefundManagement />
      )}
      {decryptSaleStatusId[menuStatus] === SaleMenuStatusType.EXCHANGE && (
        <ExchangeMananagement />
      )}
    </Layout>
  );
};

export default Sale;
