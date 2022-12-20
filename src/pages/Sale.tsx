import { useReactiveVar } from "@apollo/client";
import { saleMenuStatusVar } from "@cache/sale";

import useAuthGuard from "@hooks/useAuthGuard";
import { SaleMenuStatusType } from "@constants/sale";

import Layout from "@components/common/Layout";
import OrderManagement from "@components/sale/orderManagement";
import CancelManagement from "@components/sale/cancelManagement";
import RefundManagement from "@components/sale/refundManagement";
import ExchangeMananagement from "@components/sale/exchangeManagement";

const Sale = () => {
  const saleMenuStatus = useReactiveVar(saleMenuStatusVar);

  useAuthGuard();

  return (
    <Layout>
      {saleMenuStatus === SaleMenuStatusType.ORDER && <OrderManagement />}
      {saleMenuStatus === SaleMenuStatusType.CANCEL && <CancelManagement />}
      {saleMenuStatus === SaleMenuStatusType.REFUND && <RefundManagement />}
      {saleMenuStatus === SaleMenuStatusType.EXCHANGE && (
        <ExchangeMananagement />
      )}
    </Layout>
  );
};

export default Sale;
