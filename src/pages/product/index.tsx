import styled from "styled-components";
import { HeaderNames } from "@constants/index";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/productManagement/FilterBar";
import Controller from "@components/productManagement/Controller";
import ProductTable from "@components/productManagement/ProductTable";
import Pagination from "@components/common/Pagination";

const Product = () => {
  return (
    <Layout>
      <ContentsContainer>
        <ProductContainer>
          <ContentsHeader headerName={HeaderNames.Product as HeaderNames} />
          <FilterBar />
          <Controller />
          <ProductTable />
          <Pagination />
        </ProductContainer>
      </ContentsContainer>
    </Layout>
  );
};

const ProductContainer = styled.div`
  min-width: 1182px;
`;

export default Product;
