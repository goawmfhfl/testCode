import styled from "styled-components/macro";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { compareAsc } from "date-fns";

import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";

import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
  IS_B_MARKET_PRODUCT,
} from "@cache/productForm";
import downwordArrowBig from "@icons/arrow-downward-big.svg";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import useCategories from "@hooks/useCategories";
import contructCategories from "@utils/contructCategories";
import { CategoriesType } from "@models/index";
import { loadingSpinnerVisibilityVar, systemModalVar } from "@cache/index";
import useShopInfo from "@hooks/useShopInfo";
import { CategoryNames, CATEGORY_NAMES } from "@constants/category";
import Checkbox from "@components/common/input/Checkbox";
import questionMarkIconSource from "@icons/questionmark.svg";

const CategorySection = () => {
  const { watch, register, setValue } = useFormContext();
  const { loading: isCategoryLoading, data: categoryData } = useCategories();
  const { loading: isShopLoading, data: shopInfoData } = useShopInfo();

  const [categories, setCategories] =
    useState<{
      firstCategories: Array<CategoryNames>;
      secondCategories: {
        [key: string]: Array<CategoryNames>;
      };
      thirdCategories: {
        [key: string]: Array<CategoryNames>;
      }[];
    }>();

  const selectedFirstCategory: CategoryNames = watch(
    CATEGORY_FIRST
  ) as CategoryNames;
  const selectedSecondCategory: CategoryNames = watch(
    CATEGORY_SECOND
  ) as CategoryNames;

  const categoryDepthFirst: Array<CategoryNames> =
    categories?.firstCategories || [];

  const categoryDepthSecond: Array<CategoryNames> =
    categories?.secondCategories[selectedFirstCategory] || [];

  const categoryDepthThird: Array<CategoryNames> =
    categories?.secondCategories[selectedSecondCategory] || [];

  useEffect(() => {
    const categories: Array<CategoriesType> =
      categoryData?.getCategories.categories || [];
    const recontructCategories = contructCategories(categories);
    setCategories(recontructCategories);
  }, [categoryData]);

  useEffect(() => {
    const isLoading = isCategoryLoading || isShopLoading;

    loadingSpinnerVisibilityVar(isLoading);
  }, [isCategoryLoading || isShopLoading]);

  if (!shopInfoData || !shopInfoData.getShopInfo.shop) return <></>;

  const { safetyAuthentication, safetyAuthenticationExpiredDate } =
    shopInfoData.getShopInfo.shop;
  const isValidAuthentication =
    compareAsc(new Date(safetyAuthenticationExpiredDate), new Date()) > -1;

  const isSafetyAuthenticated =
    safetyAuthentication &&
    safetyAuthenticationExpiredDate &&
    isValidAuthentication;

  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc} width={"472px"}>
        ??????????????? ????????? ?????? ???????????????. <br /> ????????? ?????? ?????? ???????????????
        ????????? ?????? ?????? ??????????????? ???????????? ??? ??? ????????????.
      </NoticeContainer>

      <BMarket>
        <Checkbox {...register(IS_B_MARKET_PRODUCT)} />??? ????????? B-MARKET
        ???????????????. <QuestionMark src={questionMarkIconSource} />
        <NoticeContainer icon={questionMarkIconSource}>
          B-MARKET??? ?????????????????? ???????????? ?????? ????????? ???????????? B??? ?????????
          <br />
          ????????? ????????? ????????? ??? ?????? ???????????? ?????????.
          <br />
          B??? ?????? ????????? ????????? ?????? ????????? B-MARKET ??????????????? ???????????????.
          <br />
          B??? ????????? ?????? ????????? ???????????? ????????? ???????????? ??????????????????.
        </NoticeContainer>
      </BMarket>

      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"231px"}
            {...register(CATEGORY_FIRST)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setValue(CATEGORY_FIRST, e.target.value);
              setValue(CATEGORY_SECOND, "");
              setValue(CATEGORY_THIRD, "");
            }}
          >
            {[
              {
                name: "???????????? ??????????????????",
                value: "",
              },
              ...categoryDepthFirst.map((value: string) => ({
                name: value,
                value,
              })),
            ].map((option) => {
              return (
                <Option key={option.value} value={option.value}>
                  {option.value ? CATEGORY_NAMES[option.value] : option.name}
                </Option>
              );
            })}
          </Dropdown>
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"231px"}
            {...{
              ...register(CATEGORY_SECOND),
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();

                setValue(CATEGORY_SECOND, e.target.value);
                setValue(CATEGORY_THIRD, "");
              },
            }}
            disabled={!categoryDepthSecond.length ? true : false}
          >
            {[
              { name: "???????????? ??????????????????", value: "" },
              ...categoryDepthSecond.map((value) => ({
                name: value,
                value,
              })),
            ].map((option) => {
              return (
                <Option key={option.value} value={option.value}>
                  {option.value ? CATEGORY_NAMES[option.value] : option.name}
                </Option>
              );
            })}
          </Dropdown>
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"247px"}
            {...register(CATEGORY_THIRD)}
            disabled={true}
          >
            {[
              { name: "???????????? ??????????????????", value: "" },
              ...categoryDepthThird.map((value) => ({
                name: value,
                value: value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))}
          </Dropdown>
        </DropdownWrapper>
      </DropdownContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const BMarket = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  ${({ theme }) => theme.typo.korean.subHeadline.basic};

  margin-top: 11px;
`;

const QuestionMark = styled.img`
  margin-left: 7px;

  & + div {
    width: 418px;

    position: absolute;
    top: calc(30px);
    left: 220px;
    z-index: 500;

    display: none;
  }

  &:hover {
    & + div {
      display: flex;
    }
  }
`;

const DropdownContainer = styled.div`
  display: flex;

  margin-top: 19px;

  & > select {
    margin-right: 16px;
  }
`;

const DropdownLabel = styled.label`
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  margin-left: 16px;
  margin-bottom: 8px;
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-right: 16px;
`;

export default CategorySection;
