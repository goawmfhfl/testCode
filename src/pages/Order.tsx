import Layout from "@components/common/Layout";
import OrderManagement from "@components/order/OrderManagement";
import useAuthGuard from "@hooks/useAuthGuard";

const Order = () => {
  useAuthGuard();

  return (
    <Layout>
      <OrderManagement />
    </Layout>
  );
};

export default Order;
