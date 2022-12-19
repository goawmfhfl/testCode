import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/sale/cancelManagement/FilterBar";
import Controller from "@components/sale/cancelManagement/Controller";
import CancelTable from "@components/sale/cancelManagement/CancelTable";

const CancelManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={HeaderNames.Cancel} />
      <FilterBar />
      <Controller />
      <CancelTable />
    </ContentsContainer>
  );
};

export default CancelManagement;
