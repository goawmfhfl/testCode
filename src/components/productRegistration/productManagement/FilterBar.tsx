import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import { commonFilterOptionVar, paginationSkipVar } from "@cache/index";
import { filterOptionVar } from "@cache/productManagement";
import { Pathnames } from "@constants/index";
import { ProductStatus } from "@constants/product";

import useLazyAllProductStatus from "@hooks/product/useLazyAllProductStatus";

import questionMarkSrc from "@icons/questionmark.svg";
import Button from "@components/common/Button";
import useLazyProducts from "@hooks/product/useLazyProducts";

const FilterBar = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: productStatus,
    getAllProductStatus,
  } = useLazyAllProductStatus();

  const { data: productsData, getProducts } = useLazyProducts();

  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { status } = useReactiveVar(filterOptionVar);

  const products = productStatus?.getAllProductsBySeller.products || [];

  const searchResultLength =
    productsData?.getAllProductsBySeller.totalResults || 0;
  const productsLength = {
    allProducts: products.length,
    onSale: products.filter((list) => list.status === ProductStatus.ON_SALE)
      .length,
    stopSale: products.filter((list) => list.status === ProductStatus.STOP_SALE)
      .length,
    soldOut: products.filter((list) => list.status === ProductStatus.SOLD_OUT)
      .length,
  };

  const { allProducts, onSale, stopSale, soldOut } = productsLength;

  const handleFilterOptionNameClick =
    (filterOptionName: ProductStatus) => () => {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: 1,
      });
      paginationSkipVar(0);
      filterOptionVar({ status: filterOptionName });
    };

  const handleProductRegistrationButtonClick = () => {
    navigate(Pathnames.ProductRegistration);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getAllProductStatus({
        variables: {
          input: {
            page: null,
            skip: null,
            status: null,
            query: null,
          },
        },
      });
    })();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getProducts({
        variables: {
          input: {
            page: null,
            skip: null,
            status,
            query,
          },
        },
      });
    })();
  }, [query]);

  return (
    <Container>
      {!query ? (
        <FilterList>
          <Filter
            onClick={handleFilterOptionNameClick(null)}
            isActvie={status === null}
          >
            전체 {allProducts}
          </Filter>
          <Filter
            onClick={handleFilterOptionNameClick(ProductStatus.ON_SALE)}
            isActvie={status === ProductStatus.ON_SALE}
          >
            판매중 {onSale}
          </Filter>
          <Filter
            onClick={handleFilterOptionNameClick(ProductStatus.STOP_SALE)}
            isActvie={status === ProductStatus.STOP_SALE}
          >
            숨김 {stopSale}
          </Filter>
          <Filter
            onClick={handleFilterOptionNameClick(ProductStatus.SOLD_OUT)}
            isActvie={status === ProductStatus.SOLD_OUT}
          >
            <QuestionMarkIcon src={questionMarkSrc} />
            품절 {soldOut}
          </Filter>
        </FilterList>
      ) : (
        <FilterList>
          <Filter onClick={handleFilterOptionNameClick(null)} isActvie={true}>
            검색 {searchResultLength}
          </Filter>
        </FilterList>
      )}

      <Button
        size="big"
        width="126px"
        type="button"
        className="positive"
        onClick={handleProductRegistrationButtonClick}
      >
        상품 등록
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FilterList = styled.ul`
  display: flex;

  height: 48px;
  border-radius: 7px 7px 0px 0px;
  background-color: ${({ theme: { palette } }) => palette.white};

  font-family: "Spoqa Han Sans Neo";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.015em;
  text-align: left;
`;

const Filter = styled.li<{ isActvie: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 14px 56px;
  border-bottom: 1px solid
    ${({ theme: { palette }, isActvie }) =>
      isActvie ? palette.grey500 : "none"};

  cursor: pointer;
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export default FilterBar;
