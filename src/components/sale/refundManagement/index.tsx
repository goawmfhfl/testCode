import { useEffect } from "react";
import styled from "styled-components/macro";
import { HeaderNames } from "@constants/index";

import { commonSaleFilterOptionVar } from "@cache/sale";
import { OrderStatusGroup, OrderStatusType } from "@constants/sale";

import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/refundManagement/FilterBar";
import Controller from "@components/sale/refundManagement/Controller";
import RefundTable from "@components/sale/refundManagement/RefundTable";
import Pagination from "@components/common/Pagination";

const RefundManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Refund} />
      <FilterBar />
      <Controller />
      <RefundTable />
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
