import styled from "styled-components";
import { HeaderNames } from "@constants/index";

import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/refundManagement/FilterBar";
import Controller from "@components/sale/refundManagement/Controller";
import Pagination from "@components/common/Pagination";

const RefundManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Refund} />
      <FilterBar />
      <Controller />
      <Pagination />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

export default RefundManagement;
