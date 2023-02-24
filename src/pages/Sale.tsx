import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SaleMenuStatusType } from "@constants/sale";
import { decryptSaleStatusId } from "@constants/index";

import useAuthGuard from "@hooks/useAuthGuard";
import useLazyOrderStatus from "@hooks/order/useLazyOrderStatus";

import Layout from "@components/common/Layout";
import OrderManagement from "@components/sale/orderManagement";
import CancelManagement from "@components/sale/cancelManagement";
import RefundManagement from "@components/sale/refundManagement";
import ExchangeMananagement from "@components/sale/exchangeManagement";
import { orderStatusGroupVar } from "@cache/sale";

const Sale = () => {
  const [searchParams] = useSearchParams();
  const menuStatus = searchParams.get("statusId");

  const { getOrderStatus } = useLazyOrderStatus();
  useAuthGuard();

  useEffect(() => {
    void (async () => {
      const {
        data: {
          getOrdersBySeller: { ok, error, totalOrderItems },
        },
      } = await getOrderStatus({
        variables: {
          input: {
            page: 1,
          },
        },
      });

      if (ok) {
        const hasOrderItems = !!totalOrderItems && !!totalOrderItems.length;
        if (!hasOrderItems) {
          return "";
        }

        const orderStatusGroup = totalOrderItems.map(
          ({ orderStatusGroup }) => orderStatusGroup
        );

        orderStatusGroupVar(orderStatusGroup);
      }
      if (error) {
        console.log("error");
      }
    })();
  }, []);

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
