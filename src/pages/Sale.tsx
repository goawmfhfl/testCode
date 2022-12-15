import { useReactiveVar } from "@apollo/client";
import { saleMenuStatusVar } from "@cache/sale";

import useAuthGuard from "@hooks/useAuthGuard";
import { SaleMenuStatusType } from "@constants/sale";

import Layout from "@components/common/Layout";
import OrderManagement from "@components/sale/orderManagement";
import CancelManagement from "@components/sale/cancelManagement";

const Sale = () => {
  const saleMenuStatus = useReactiveVar(saleMenuStatusVar);

  useAuthGuard();

  return (
    <Layout>
      {saleMenuStatus === SaleMenuStatusType.ORDER && <OrderManagement />}
      {saleMenuStatus === SaleMenuStatusType.CANCEL && <CancelManagement />}
    </Layout>
  );
};

export default Sale;
