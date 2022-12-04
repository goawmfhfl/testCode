import styled from "styled-components/macro";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import { commonFilterOptionVar, paginationSkipVar } from "@cache/index";
import { filterOptionVar } from "@cache/productManagement";
import { Pathnames } from "@constants/index";
import { ProductStatus } from "@constants/product";
import useLazyAllProductStatus from "@hooks/product/useLazyAllProductStatus";
import useLazyProducts from "@hooks/product/useLazyProducts";
import { getProductLength } from "@utils/product/management";
import questionMarkSrc from "@icons/questionmark.svg";

import Button from "@components/common/Button";
import FilterBarContainer from "@components/order/FilterBarContainer";

const FilterBar = () => {
  const navigate = useNavigate();

  const { data: productStatus, getAllProductStatus } =
    useLazyAllProductStatus();
  const { data: productsData, getProducts } = useLazyProducts();
  const { query } = useReactiveVar(commonFilterOptionVar);
  const { status: selectedStatus } = useReactiveVar(filterOptionVar);

  const products = productStatus?.getAllProductsBySeller.products || [];
  const productLength = getProductLength(products);

  const searchResultLength =
    productsData?.getAllProductsBySeller.totalResults || 0;

  const { allProducts, onSale, stopSale, soldOut, temporary } = productLength;

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
            status: selectedStatus,
            query,
          },
        },
      });
    })();
  }, [query]);

  return (
    <FilterBarContainer
      button={
        <Button
          size="big"
          width="126px"
          type="button"
          className="positive"
          onClick={handleProductRegistrationButtonClick}
        >
          상품 등록
        </Button>
      }
      searchResultLength={searchResultLength}
    >
      <FilterList>
        <Filter
          onClick={handleFilterOptionNameClick(null)}
          isActive={selectedStatus === null}
        >
          전체 {allProducts}
        </Filter>
        <Filter
          onClick={handleFilterOptionNameClick(ProductStatus.ON_SALE)}
          isActive={selectedStatus === ProductStatus.ON_SALE}
        >
          판매중 {onSale}
        </Filter>
        <Filter
          onClick={handleFilterOptionNameClick(ProductStatus.STOP_SALE)}
          isActive={selectedStatus === ProductStatus.STOP_SALE}
        >
          숨김 {stopSale}
        </Filter>
        <Filter
          onClick={handleFilterOptionNameClick(ProductStatus.SOLD_OUT)}
          isActive={selectedStatus === ProductStatus.SOLD_OUT}
        >
          <QuestionMarkIcon src={questionMarkSrc} />
          품절 {soldOut}
        </Filter>
        <Filter
          onClick={handleFilterOptionNameClick(ProductStatus.TEMPORARY)}
          isActive={selectedStatus === ProductStatus.TEMPORARY}
        >
          임시저장 {temporary}
        </Filter>
      </FilterList>
    </FilterBarContainer>
  );
};

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

const Filter = styled.li<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 14px 56px;
  border-bottom: 1px solid
    ${({ theme: { palette }, isActive }) =>
      isActive ? palette.grey500 : "none"};

  cursor: pointer;
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export default FilterBar;
