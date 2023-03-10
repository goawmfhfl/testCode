import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";
import { filterOptionVar } from "@cache/productManagement";
import { decryptProductStatusId, Pathnames } from "@constants/index";
import { ProductStatus } from "@constants/product";
import useLazyGetProductStatus from "@hooks/product/useLazyGetProductStatus";
import { getProductLength } from "@utils/product/management";

import questionMarkSrc from "@icons/questionmark.svg";
import Button from "@components/common/Button";
import FilterBarContainer from "@components/sale/FilterBarContainer";

const FilterBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusId = searchParams.get("statusId");

  const { data: productStatus, getProductStatus } = useLazyGetProductStatus();

  const totalPageLength = useReactiveVar(totalPageLengthVar);
  const products = productStatus?.getProductsBySeller.products || [];
  const productLength = getProductLength(products);
  const { all, onSale, stopSale, soldOut, temporary } = productLength;

  const [showNotice, setShowNotice] = useState<boolean>(false);

  const handleProductRegistrationButtonClick = () => {
    navigate(Pathnames.ProductRegistration);
  };

  useEffect(() => {
    filterOptionVar({
      status: decryptProductStatusId[statusId] as ProductStatus,
    });
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
    });
    paginationSkipVar(0);
  }, [searchParams]);

  useEffect(() => {
    void (async () => {
      await getProductStatus({
        variables: {
          input: {
            page: 1,
            skip: null,
            status: null,
            query: null,
          },
        },
        fetchPolicy: "no-cache",
      });
    })();
  }, []);

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
          ?????? ??????
        </Button>
      }
      searchResultLength={totalPageLength}
    >
      <FilterList>
        <Link to={`${Pathnames.Product}`}>
          <Filter isActive={!statusId}>?????? {all}</Filter>
        </Link>
        <Link to={`${Pathnames.ProductOnsale}`}>
          <Filter
            isActive={
              decryptProductStatusId[statusId] === ProductStatus.ON_SALE
            }
          >
            ????????? {onSale}
          </Filter>
        </Link>
        <Link to={`${Pathnames.ProductStopSale}`}>
          <Filter
            isActive={
              decryptProductStatusId[statusId] === ProductStatus.STOP_SALE
            }
          >
            ?????? {stopSale}
          </Filter>
        </Link>
        <Link to={`${Pathnames.ProductSoldOut}`}>
          <Filter
            isActive={
              decryptProductStatusId[statusId] === ProductStatus.SOLD_OUT
            }
          >
            <QuestionMarkIcon
              src={questionMarkSrc}
              onMouseOver={() => setShowNotice(true)}
              onMouseLeave={() => setShowNotice(false)}
            />
            ?????? {soldOut}
            {showNotice && (
              <SoldOutNoticeContainer>
                <NoticeIcon src={questionMarkSrc} />
                <NoticeText>
                  ????????? ????????? ??????????????? ?????????'???????????? ?????? ???????????????.
                </NoticeText>
              </SoldOutNoticeContainer>
            )}
          </Filter>
        </Link>
        <Link to={`${Pathnames.ProductTemporary}`}>
          <Filter
            isActive={
              decryptProductStatusId[statusId] === ProductStatus.TEMPORARY
            }
          >
            ???????????? {temporary}
          </Filter>
        </Link>
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
  position: relative;

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

const SoldOutNoticeContainer = styled.div`
  position: absolute;
  left: 35%;
  top: -25%;

  transform: translateY(-50%);

  z-index: 10;

  display: flex;
  width: 350px;
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

const NoticeText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
`;

export default FilterBar;
