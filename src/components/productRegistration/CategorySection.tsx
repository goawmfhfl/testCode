import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
} from "@cache/productRegistration";

import downwordArrowBig from "@icons/arrow-downward-big.svg";
import exclamationMarkSrc from "@icons/exclamationmark.svg";
import useCategories from "@hooks/useCategories";
import contructCategories from "@utils/contructCategories";
import { CategoriesType, CategoryName } from "@models/index";

const CategorySection = () => {
  const { watch, register, setValue } = useFormContext();
  const { loading, error, data } = useCategories();
  const [categories, setCategories] =
    useState<{
      firstCategories: Array<CategoryName>;
      secondCategories: {
        [key: string]: Array<CategoryName>;
      };
      thirdCategories: {
        [key: string]: Array<CategoryName>;
      }[];
    }>();

  const selectedFirstCategory: CategoryName = watch(
    CATEGORY_FIRST
  ) as CategoryName;
  const selectedSecondCategory: CategoryName = watch(
    CATEGORY_SECOND
  ) as CategoryName;

  const categoryDepthFirst: Array<CategoryName> =
    categories?.firstCategories || [];

  const categoryDepthSecond: Array<CategoryName> =
    categories?.secondCategories[selectedFirstCategory] || [];

  const categoryDepthThird: Array<CategoryName> =
    categories?.secondCategories[selectedSecondCategory] || [];

  useEffect(() => {
    setValue(CATEGORY_SECOND, "");
    setValue(CATEGORY_THIRD, "");
  }, [selectedFirstCategory]);

  useEffect(() => {
    setValue(CATEGORY_THIRD, "");
  }, [selectedSecondCategory]);

  useEffect(() => {
    const categories: Array<CategoriesType> =
      data?.getAllCategories.categories || [];
    const recontructCategories = contructCategories(categories);
    setCategories(recontructCategories);
  }, [data]);

  if (loading) return <>...loading</>;
  if (error) return <>...error</>;

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
            value={watch(CATEGORY_FIRST) as string}
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
            ].map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))}
          </Dropdown>
        </DropdownWrapper>

        <DropdownWrapper>
          <DropdownLabel>중분류</DropdownLabel>
          <Dropdown
            sizing={"big"}
            arrowSrc={downwordArrowBig}
            width={"231px"}
            {...register(CATEGORY_SECOND)}
            disabled={!categoryDepthSecond.length ? true : false}
          >
            {[
              { name: "중분류를 선택해주세요", value: "" },
              ...categoryDepthSecond.map((value) => ({
                name: value,
                value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))}
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
