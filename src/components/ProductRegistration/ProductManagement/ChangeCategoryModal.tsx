import React, { useState } from "react";
import styled from "styled-components";
import { modalVar, systemModalVar } from "@cache/index";
import { useForm } from "react-hook-form";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
} from "@cache/productRegistration";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";

import downwordArrowBig from "@icons/arrow-downward-big.svg";
import questionMarkIconSrc from "@icons/questionmark.svg";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { CHANGE_PRODUCTS_INFO } from "@graphql/mutations/changeProductsInfo";
import { CATEGORIES, categoryMapper } from "@constants/index";

import {
  ChangeProductsInfoType,
  ChangeProductsInfoInputType,
} from "@graphql/mutations/changeProductsInfo";
import {
  checkAllBoxStatusVar,
  filterOptionQueryVar,
  filterOptionSkipQuantityVar,
  filterOptionStatusVar,
  getProductBySellerVar,
  selectedProductListVar,
  showHasServerErrorModal,
} from "@cache/ProductManagement";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
} from "@graphql/queries/getAllProductsBySeller";

const ChangeCategoryModal = () => {
  const { watch, register } = useForm();

  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );
  const filterOptionSkipQuantity: number = useReactiveVar(
    filterOptionSkipQuantityVar
  );
  const filterQuery = useReactiveVar(filterOptionQueryVar);

  const selectedProdcutList = useReactiveVar(selectedProductListVar);
  const selectedProductListIds: Array<number> = selectedProdcutList.map(
    (list) => list.id
  );

  const [isBmarketChecked, setIsBmarketChecked] = useState<boolean>(false);

  const selectedFirstCategory: string = watch(CATEGORY_FIRST) as string;
  const selectedSecondCategory: string = watch(CATEGORY_SECOND) as string;

  const categoryDepthFirst: Array<string> = CATEGORIES.CATEGORY_FIRST;
  const categoryDepthSecond: Array<string> =
    (CATEGORIES.CATEGORY_SECOND[selectedFirstCategory] as Array<string>) || [];
  const categoryDepthThird: Array<string> =
    (CATEGORIES.CATEGORY_THIRD[selectedSecondCategory] as Array<string>) || [];

  const [getProductList] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: filterOptionSkipQuantity,
        status: filterOptionStatus,
        query: filterQuery,
      },
    },
  });

  const [updateCategory] = useMutation<
    ChangeProductsInfoType,
    ChangeProductsInfoInputType
  >(CHANGE_PRODUCTS_INFO, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: {
            page: 1,
            skip: filterOptionSkipQuantity,
            status: filterOptionStatus,
            query: filterQuery,
          },
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
  });

  const handleCheckBoxChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setIsBmarketChecked(checked);
  };

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const updateCategoryClick = () => {
    if (!selectedSecondCategory)
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: "카테고리를 선택해주세요.",
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });

    if (selectedSecondCategory) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            {selectedProdcutList.length}개 상품의 카테고리를 <br />
            이대로 변경하시겠습니까?
          </>
        ),
        cancelButtonVisibility: true,
        confirmButtonVisibility: true,
        confirmButtonClickHandler: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            const {
              data: {
                changeProductsInfo: { ok, error },
              },
            } = await updateCategory({
              variables: {
                input: {
                  productIds: selectedProductListIds,
                  categoryName: selectedSecondCategory,
                  isBmarket: isBmarketChecked,
                },
              },
            });

            if (ok) {
              const {
                data: {
                  getAllProductsBySeller: {
                    products,
                    ok: refetchOk,
                    error: refetchError,
                  },
                },
              } = await getProductList();

              if (refetchOk) {
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  description: "카테고리가 변경되었습니다.",
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,

                  confirmButtonClickHandler: () => {
                    getProductBySellerVar(
                      products.map((list) => ({
                        ...list,
                        isChecked: false,
                      }))
                    );

                    systemModalVar({
                      ...systemModalVar(),
                      isVisible: false,
                    });

                    modalVar({
                      ...modalVar(),
                      isVisible: false,
                    });

                    selectedProductListVar([]);
                    checkAllBoxStatusVar(false);
                  },
                });
              }

              if (refetchError) {
                showHasServerErrorModal(refetchError);
              }
            }

            if (error) {
              showHasServerErrorModal(error);
            }
          })();
        },
      });
    }
  };

  return (
    <Container>
      <CloseButton onClick={handleCloseButtonClick}>X</CloseButton>
      <Title>카테고리 변경하기</Title>
      <Notice>상품 다중 선택시 카테고리가 일괄 변경됩니다.</Notice>
      <BmarketContainer>
        <CheckBox onChange={handleCheckBoxChange} checked={isBmarketChecked} />
        <Description>이 상품은 B-MARKET 상품입니다</Description>
        <NoticeIcon src={questionMarkIconSrc} />
      </BmarketContainer>
      <CategoryContainer>
        <DropdownWrapper>
          <DropdownLabel>대분류</DropdownLabel>
          <Dropdown
            sizing={"medium"}
            arrowSrc={downwordArrowBig}
            {...register(CATEGORY_FIRST)}
            value={watch(CATEGORY_FIRST) as string}
          >
            {[
              {
                name: "대분류를 선택해주세요",
                value: "",
              },
              ...categoryDepthFirst.map((value: string) => ({
                name: categoryMapper[value],
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
            sizing={"medium"}
            arrowSrc={downwordArrowBig}
            {...register(CATEGORY_SECOND)}
            value={watch(CATEGORY_SECOND) as string}
            disabled={!categoryDepthSecond.length ? true : false}
          >
            {[
              {
                name: "중분류를 선택해주세요",
                value: "",
              },
              ...categoryDepthSecond.map((value: string) => ({
                name: categoryMapper[value],
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
            sizing={"medium"}
            arrowSrc={downwordArrowBig}
            {...register(CATEGORY_THIRD)}
            value={watch(CATEGORY_THIRD) as string}
            disabled={!categoryDepthThird.length ? true : false}
          >
            {[
              {
                name: "소분류를 선택해주세요",
                value: "",
              },
              ...categoryDepthThird.map((value) => ({
                name: categoryMapper[value],
                value: value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Dropdown>
        </DropdownWrapper>
      </CategoryContainer>
      <ButtonContainer>
        <Button onClick={updateCategoryClick}>확인</Button>
        <Button onClick={handleCloseButtonClick}>취소</Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;

  padding: 1em;
`;

const CloseButton = styled.button`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Title = styled.h2`
  padding: 1em;
  background-color: gainsboro;
`;

const Notice = styled.span`
  padding: 1em;
  background-color: goldenrod;
`;

const BmarketContainer = styled.div`
  width: 100%;
  padding: 1em;

  background-color: green;
`;
const CheckBox = styled.input.attrs({ type: "checkbox" })``;

const Description = styled.span``;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
`;

const CategoryContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1em;

  background-color: yellow;
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const DropdownLabel = styled.span`
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 1em;

  background-color: grey;
`;

const Button = styled.button`
  margin-right: 5px;
`;

export default ChangeCategoryModal;
