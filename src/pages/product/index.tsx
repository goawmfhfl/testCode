import { HeaderNames } from "@constants/index";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/productRegistration/productManagement/FilterBar";
import Controller from "@components/productRegistration/productManagement/Controller";
import ProductTable from "@components/productRegistration/productManagement/ProductTable";

const Product = () => {
  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName={HeaderNames.Product as HeaderNames} />
        <FilterBar />
        <Controller />
        <ProductTable />
      </ContentsContainer>
    </Layout>
  );
};

export default Product;
