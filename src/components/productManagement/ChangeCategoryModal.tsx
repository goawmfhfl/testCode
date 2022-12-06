import React, { useEffect, useState } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import styled from "styled-components/macro";
import {
  checkedProductIdsVar,
  DetailNoticeVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";
import { useForm } from "react-hook-form";
import {
  CATEGORY_FIRST,
  CATEGORY_SECOND,
  CATEGORY_THIRD,
} from "@cache/productForm";

import downwordArrowBig from "@icons/arrow-downward-big.svg";
import questionMarkIconSrc from "@icons/questionmark.svg";
import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";

import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import NoticeContainer from "@components/common/NoticeContainer";
import Button from "@components/common/Button";

import { CHANGE_PRODUCTS_INFO_BY_SELLER } from "@graphql/mutations/changeProductsInfoBySeller";
import {
  ChangeProductsInfoBySellerType,
  ChangeProductsInfoBySellerInputType,
} from "@graphql/mutations/changeProductsInfoBySeller";

import {
  showHasServerErrorModal,
  filterOptionVar,
} from "@cache/productManagement";

import { checkAllBoxStatusVar } from "@cache/index";

import { GET_ALL_PRODUCTS_BY_SELLER } from "@graphql/queries/getAllProductsBySeller";
import useCategories from "@hooks/useCategories";
import contructCategories from "@utils/contructCategories";
import { CategoriesType } from "@models/index";
import { CategoryNames } from "@constants/category";

const ChangeCategoryModal = () => {
  const { watch, register } = useForm();
  const { loading, error, data } = useCategories();
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

  const filterOption = useReactiveVar(filterOptionVar);
  const checkedProductIds = useReactiveVar(checkedProductIdsVar);
  const [isBmarketChecked, setIsBmarketChecked] = useState<boolean>(false);

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

  const detailNotice = useReactiveVar(DetailNoticeVar);

  const [updateCategory] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",

    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetAllProductsBySeller",
    ],
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
            {checkedProductIds.length}개 상품의 카테고리를 <br />
            이대로 변경하시겠습니까?
          </>
        ),
        cancelButtonVisibility: true,
        confirmButtonVisibility: true,
        confirmButtonClickHandler: () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (async () => {
              loadingSpinnerVisibilityVar(true);
              const {
                data: {
                  changeProductsInfoBySeller: { ok, error },
                },
              } = await updateCategory({
                variables: {
                  input: {
                    productIds: checkedProductIds,
                    categoryName: selectedSecondCategory,
                    isBmarket: isBmarketChecked,
                  },
                },
              });

              if (ok) {
                loadingSpinnerVisibilityVar(false);
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  description: "카테고리가 변경되었습니다.",
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,

                  confirmButtonClickHandler: () => {
                    systemModalVar({
                      ...systemModalVar(),
                      isVisible: false,
                    });

                    modalVar({
                      ...modalVar(),
                      isVisible: false,
                    });

                    checkedProductIdsVar([]);
                    checkAllBoxStatusVar(false);
                  },
                });
              }

              if (error) {
                loadingSpinnerVisibilityVar(false);
                showHasServerErrorModal(error, "카테고리 변경");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "카테고리 변경");
          }
        },
      });
    }
  };

  const showNoticeClick = () => {
    DetailNoticeVar({
      isVisible: !detailNotice.isVisible,
      component: (
        <NoticeContainer icon={questionMarkIconSrc} width={"418px"}>
          B-MARKET은 작업과정에서 발생하는 작은 흠으로 파기되는B급 상품을
          <br />
          할인된 가격에 판매할 수 있는 카테고리 입니다.
          <br />
          B급 상품 설정에 체크시 해당 상품은 B-MARKET 카테고리에 등록됩니다.
          <br />
          B급 상품은 정상 상품의 가격보다 할인된 가격으로 책정해주세요.
        </NoticeContainer>
      ),
    });
  };

  useEffect(() => {
    const categories: Array<CategoriesType> =
      data?.getAllCategories.categories || [];
    const recontructCategories = contructCategories(categories);
    setCategories(recontructCategories);
  }, [data]);

  useEffect(() => {
    return () => {
      DetailNoticeVar({
        isVisible: false,
        component: <></>,
      });
    };
  }, []);

  return (
    <Container>
      <CloseButton onClick={handleCloseButtonClick} src={closeIconSource} />
      <Title>카테고리 변경하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"291px"}>
        상품 다중 선택 시 카테고리가 일괄 변경됩니다.
      </NoticeContainer>

      <BmarketContainer>
        <CheckBox onChange={handleCheckBoxChange} checked={isBmarketChecked} />
        <Description>이 상품은 B-MARKET 상품입니다</Description>
        <NoticeIcon src={questionMarkIconSrc} onClick={showNoticeClick} />

        {detailNotice.isVisible && (
          <DetailNoticeLayer>{detailNotice.component}</DetailNoticeLayer>
        )}
      </BmarketContainer>
      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>대분류</DropdownLabel>
          <StyledDropdown
            sizing={"medium"}
            width={"160px"}
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
                name: value,
                value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))}
          </StyledDropdown>
        </DropdownWrapper>
        <DropdownWrapper>
          <DropdownLabel>중분류</DropdownLabel>
          <StyledDropdown
            sizing={"medium"}
            width={"160px"}
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
                name: value,
                value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))}
          </StyledDropdown>
        </DropdownWrapper>
        <DropdownWrapper>
          <DropdownLabel>소분류</DropdownLabel>
          <StyledDropdown
            sizing={"medium"}
            width={"160px"}
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
                name: value,
                value: value,
              })),
            ].map((option) => (
              <Option key={option.value} value={option.name}>
                {option.name}
              </Option>
            ))}
          </StyledDropdown>
        </DropdownWrapper>
      </DropdownContainer>
      <ButtonContainer>
        <StyledButton
          size={"small"}
          className={"positive"}
          onClick={updateCategoryClick}
        >
          확인
        </StyledButton>
        <Button size={"small"} onClick={handleCloseButtonClick}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 40px 24px 24px 24px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 24px;

  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const BmarketContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  width: 100%;
  margin: 15px 0px;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 4px;
`;

const Description = styled.span`
  margin-right: 7px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
  cursor: pointer;
`;

const DetailNoticeLayer = styled.div`
  position: absolute;
  right: 0;
  bottom: -92px;

  z-index: 1000;
`;

const DropdownContainer = styled.div`
  display: flex;
  width: 100%;
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-right: 16px;
  margin-bottom: 32px;

  &:last-child {
    margin-right: 0px;
  }
`;

const DropdownLabel = styled.span`
  margin-bottom: 10px;

  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const StyledDropdown = styled(Dropdown)`
  padding-right: 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

export default ChangeCategoryModal;
