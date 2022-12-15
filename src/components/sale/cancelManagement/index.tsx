import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/sale/cancelManagement/FilterBar";
import Controller from "@components/sale/orderManagement/Controller";
import OrderTable from "@components/sale/orderManagement/OrderTable";
import Pagination from "@components/common/Pagination";

const CancelManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={HeaderNames.Cancel} />
      <FilterBar />
      <Controller />
      <OrderTable />
      <Pagination />
    </ContentsContainer>
  );
};

export default CancelManagement;
