import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLazyQuery, useReactiveVar } from "@apollo/client";

import questionMarkSrc from "@icons/questionmark.svg";
import Button from "@components/common/Button";

import {
  GET_ALL_PRODCUCTS_STATUS_BY_SELLER,
  GetAllProductsStatusBySellerType,
  GetAllProductsStatusBySellerInPutType,
} from "@graphql/queries/getAllProductsBySeller";

import { systemModalVar, filterOptionVar } from "@cache/index";
import { getProductBySellerVar } from "@cache/productManagement";

import { Pathnames } from "@constants/index";

const FilterBar = () => {
  const navigate = useNavigate();

  const filterOption = useReactiveVar(filterOptionVar);

  const productList = useReactiveVar(getProductBySellerVar);

  const [totalPageLength, setTotalPageLength] = useState<{
    onSaleProducutsLength: number;
    stopSaleProducutsLength: number;
    soldOutProductsLength: number;
  }>({
    onSaleProducutsLength: 0,
    stopSaleProducutsLength: 0,
    soldOutProductsLength: 0,
  });

  const {
    onSaleProducutsLength,
    stopSaleProducutsLength,
    soldOutProductsLength,
  } = totalPageLength;

  const changeFilterOptionNameClick =
    (filterOptionName: string | null) => () => {
      filterOptionVar({ ...filterOption, status: filterOptionName });
    };

  const handleButtonClick = () => {
    navigate(Pathnames.ProductRegistration);
  };

  const [getOnSaleProductList] = useLazyQuery<
    GetAllProductsStatusBySellerType,
    GetAllProductsStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    variables: {
      input: {
        status: "ON_SALE",
      },
    },
    fetchPolicy: "no-cache",
  });

  const [getStopSaleProductList] = useLazyQuery<
    GetAllProductsStatusBySellerType,
    GetAllProductsStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    variables: {
      input: {
        status: "STOP_SALE",
      },
    },
    fetchPolicy: "no-cache",
  });

  const [getSoldOutProductList] = useLazyQuery<
    GetAllProductsStatusBySellerType,
    GetAllProductsStatusBySellerInPutType
  >(GET_ALL_PRODCUCTS_STATUS_BY_SELLER, {
    variables: {
      input: {
        status: "SOLD_OUT",
      },
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const {
        data: {
          getAllProductsBySeller: {
            ok: onSaleOk,
            error: onSaleError,
            totalResults: onSale,
          },
        },
      } = await getOnSaleProductList();
      const {
        data: {
          getAllProductsBySeller: {
            ok: stopSaleOk,
            error: stopSaleError,
            totalResults: stopSale,
          },
        },
      } = await getStopSaleProductList();
      const {
        data: {
          getAllProductsBySeller: {
            ok: soldOutOk,
            error: soldOutError,
            totalResults: soldOut,
          },
        },
      } = await getSoldOutProductList();

      if (onSaleOk && stopSaleOk && soldOutOk) {
        setTotalPageLength({
          onSaleProducutsLength: onSale,
          stopSaleProducutsLength: stopSale,
          soldOutProductsLength: soldOut,
        });
      }

      if (onSaleError || stopSaleError || soldOutError) {
        systemModalVar({
          ...systemModalVar(),
        });
      }
    })();
  }, [productList]);

  return (
    <Container>
      <FilterList>
        <Filter
          onClick={changeFilterOptionNameClick(null)}
          isActvie={filterOption.status === null}
        >
          전체
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("ON_SALE")}
          isActvie={filterOption.status === "ON_SALE"}
        >
          판매중{onSaleProducutsLength}
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("STOP_SALE")}
          isActvie={filterOption.status === "STOP_SALE"}
        >
          숨김{stopSaleProducutsLength}
        </Filter>
        <Filter
          onClick={changeFilterOptionNameClick("SOLD_OUT")}
          isActvie={filterOption.status === "SOLD_OUT"}
        >
          <QuestionMarkIcon src={questionMarkSrc} />
          품절{soldOutProductsLength}
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
