import React from "react";
import styled from "styled-components";

import { HeaderNames } from "@constants/index";

import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/exchangeManagement/FilterBar";
import Controller from "@components/sale/exchangeManagement/Controller";
import ExchangeTable from "@components/sale/exchangeManagement/ExchangeTable";
import Pagination from "@components/common/Pagination";

const ExchangeManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Exchange} />
      <FilterBar />
      <Controller />
      <ExchangeTable />
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
