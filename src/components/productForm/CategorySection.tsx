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
} from "@cache/productForm";
import downwordArrowBig from "@icons/arrow-downward-big.svg";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import useCategories from "@hooks/useCategories";
import contructCategories from "@utils/contructCategories";
import { CategoriesType } from "@models/index";
import { loadingSpinnerVisibilityVar, systemModalVar } from "@cache/index";
import useShopInfo from "@hooks/useShopInfo";
import { CategoryNames, CATEGORY_NAMES } from "@constants/category";

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
      categoryData?.getAllCategories.categories || [];
    const recontructCategories = contructCategories(categories);
    setCategories(recontructCategories);
  }, [categoryData]);

  useEffect(() => {
    const isLoading = isCategoryLoading || isShopLoading;

    loadingSpinnerVisibilityVar(isLoading);
  }, [isCategoryLoading || isShopLoading]);

  if (!shopInfoData) return <></>;

  const { safetyAuthentication, safetyAuthenticationExpiredDate } =
    shopInfoData.getShopInfo;

  const isSafetyAuthenticated =
    safetyAuthentication &&
    safetyAuthenticationExpiredDate &&
    compareAsc(new Date(safetyAuthenticationExpiredDate), new Date()) < 1;

  return (
    <Container>
      <NoticeContainer icon={exclamationMarkSrc} width={"472px"}>
        카테고리는 하나만 설정 가능합니다. <br /> 상품과 맞지 않는 카테고리에
        등록할 경우 강제 이동되거나 판매보류 될 수 있습니다.
      </NoticeContainer>

      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>대분류</DropdownLabel>
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
                name: "대분류를 선택해주세요",
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
          <DropdownLabel>중분류</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"231px"}
            {...{
              ...register(CATEGORY_SECOND),
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                e.preventDefault();

                const isChemicalProduct =
                  e.target.value === CategoryNames.DIFFUSER_ROOMSPRAY ||
                  e.target.value === CategoryNames.CANDLE;

                if (isChemicalProduct && !isSafetyAuthenticated) {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: true,
                    description: (
                      <>
                        샵 설정에서 안전기준 적합 확인검사를 <br />
                        인증 후 선택하실 수 있습니다.
                      </>
                    ),
                  });

                  setValue(CATEGORY_SECOND, "");
                  setValue(CATEGORY_THIRD, "");

                  return;
                }

                setValue(CATEGORY_SECOND, e.target.value);
                setValue(CATEGORY_THIRD, "");
              },
            }}
            disabled={!categoryDepthSecond.length ? true : false}
          >
            {[
              { name: "중분류를 선택해주세요", value: "" },
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
          <DropdownLabel>소분류</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"247px"}
            {...register(CATEGORY_THIRD)}
            disabled={true}
          >
            {[
              { name: "소분류를 선택해주세요", value: "" },
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

const DropdownContainer = styled.div`
  display: flex;

  margin-top: 16px;

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
