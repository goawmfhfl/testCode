import { useSearchParams } from "react-router-dom";
import useAuthGuard from "@hooks/useAuthGuard";
import { SaleMenuStatusType } from "@constants/sale";
import { decryptSaleStatusId } from "@constants/index";

import Layout from "@components/common/Layout";
import OrderManagement from "@components/sale/orderManagement";
import CancelManagement from "@components/sale/cancelManagement";
import RefundManagement from "@components/sale/refundManagement";
import ExchangeMananagement from "@components/sale/exchangeManagement";

const Sale = () => {
  const [searchParams] = useSearchParams();
  const menuStatus = searchParams.get("statusId");
  useAuthGuard();

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
