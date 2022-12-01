import { useEffect } from "react";
import { HeaderNames } from "@constants/index";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import FilterBar from "@components/productManagement/FilterBar";
import Controller from "@components/productManagement/Controller";
import ProductTable from "@components/productManagement/ProductTable";
import Pagination from "@components/common/Pagination";

import { commonFilterOptionVar } from "@cache/index";
import { filterOptionVar } from "@cache/productManagement";

const Product = () => {
  useEffect(() => {
    return () => {
      filterOptionVar({
        status: null,
      });
      commonFilterOptionVar({
        page: 1,
        skip: 20,
        query: null,
      });
    };
  }, []);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName={HeaderNames.Product as HeaderNames} />
        <FilterBar />
        <Controller />
        <ProductTable />
        <Pagination />
      </ContentsContainer>
    </Layout>
  );
};

export default Product;
