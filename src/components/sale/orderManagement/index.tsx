import { HeaderNames } from "@constants/index";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/sale/orderManagement/FilterBar";
import Controller from "@components/sale/orderManagement/Controller";
import OrderTable from "@components/sale/orderManagement/OrderTable";
import Pagination from "@components/common/Pagination";
import styled from "styled-components/macro";

const OrderManagement = () => {
  return (
    <Container>
      <ContentsHeader headerName={HeaderNames.Order} />
      <FilterBar />
      <Controller />
      <OrderTable />
      <Pagination />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 16px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

export default OrderManagement;
