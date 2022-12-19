import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/sale/cancelManagement/FilterBar";

const CancelManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={HeaderNames.Cancel} />
      <FilterBar />
    </ContentsContainer>
  );
};

export default CancelManagement;
