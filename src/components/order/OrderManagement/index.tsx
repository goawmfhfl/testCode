import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/order/OrderManagement/FilterBar";
import Controller from "@components/order/OrderManagement/Controller";
import OrderTable from "@components/order/OrderManagement/OrderTable";

const OrderManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={HeaderNames.Order} />
      <FilterBar />
      <Controller />
      <OrderTable />
    </ContentsContainer>
  );
};

export default OrderManagement;
