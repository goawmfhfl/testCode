import styled from "styled-components";
import { HeaderNames } from "@constants/index";

import Layout from "@components/common/Layout";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/productManagement/FilterBar";
import Controller from "@components/productManagement/Controller";
import ProductTable from "@components/productManagement/ProductTable";
import Pagination from "@components/common/Pagination";
import useAuthGuard from "@hooks/useAuthGuard";

const Product = () => {
  useAuthGuard();

  return (
    <Layout>
      <Container>
        <ContentsHeader headerName={HeaderNames.Product} />
        <FilterBar />
        <Controller />
        <ProductTable />
        <Pagination />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  width: 100%;
  min-width: 1182px;
  padding: 12px 20px;

  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

export default Product;
