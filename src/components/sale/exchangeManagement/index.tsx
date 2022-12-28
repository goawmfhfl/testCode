import styled from "styled-components/macro";

import { HeaderNames } from "@constants/index";

import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/exchangeManagement/FilterBar";
import Controller from "@components/sale/exchangeManagement/Controller";
import Pagination from "@components/common/Pagination";

const ExchangeManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Exchange} />
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

export default ExchangeManagement;
