import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/cancelManagement/FilterBar";
import Controller from "@components/sale/cancelManagement/Controller";
import CancelTable from "@components/sale/cancelManagement/CancelTable";
import styled from "styled-components";

const CancelManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Cancel} />
      <FilterBar />
      <Controller />
      <CancelTable />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

export default CancelManagement;
