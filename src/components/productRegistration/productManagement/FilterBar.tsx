import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import { filterOptionVar } from "@cache/productManagement";
import { Pathnames } from "@constants/index";

import questionMarkSrc from "@icons/questionmark.svg";
import Button from "@components/common/Button";

import useLazyAllProductsStatus from "@hooks/product/useLazyAllProductsStatus";
import { ProductStatus } from "@constants/product";

const FilterBar = () => {
  const navigate = useNavigate();

  const {
    loading,
    error,
    getAllProductsStatus,
    allProductsLength,
    onSaleLength,
    stopSaleLength,
    soldOutLength,
  } = useLazyAllProductsStatus();

  const filterOption = useReactiveVar(filterOptionVar);

  const changeFilterOptionNameClick =
    (filterOptionName: ProductStatus) => () => {
      filterOptionVar({ ...filterOption, status: filterOptionName });
    };

  const handleButtonClick = () => {
    navigate(Pathnames.ProductRegistration);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getAllProductsStatus({
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

  return (
    <Container>
      <FilterList>
        <Filter
          onClick={changeFilterOptionNameClick(null)}
          isActvie={filterOption.status === null}
        >
          전체 {allProductsLength}
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick(ProductStatus.ON_SALE)}
          isActvie={filterOption.status === ProductStatus.ON_SALE}
        >
          판매중 {onSaleLength}
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick(ProductStatus.STOP_SALE)}
          isActvie={filterOption.status === ProductStatus.STOP_SALE}
        >
          숨김 {stopSaleLength}
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick(ProductStatus.SOLD_OUT)}
          isActvie={filterOption.status === ProductStatus.SOLD_OUT}
        >
          <QuestionMarkIcon src={questionMarkSrc} />
          품절 {soldOutLength}
        </Filter>
      </FilterList>
      <Button
        size="big"
        width="126px"
        type="button"
        className="positive"
        onClick={handleButtonClick}
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
