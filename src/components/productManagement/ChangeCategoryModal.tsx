import React, { useEffect, useState } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import styled from "styled-components/macro";
import {
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
  checkedProductsVar,
} from "@cache/productManagement";

import { checkAllBoxStatusVar } from "@cache/index";

import { GET_PRODUCTS_BY_SELLER } from "@graphql/queries/getProductsBySeller";
import useCategories from "@hooks/useCategories";
import contructCategories from "@utils/contructCategories";
import { CategoryNames, CATEGORY_NAMES } from "@constants/category";
import { CategoriesType } from "@models/index";
import { CaculatedProductsType } from "@models/product/management";

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

  const checkedProducts: Array<CaculatedProductsType> =
    useReactiveVar(checkedProductsVar);

  const checkedProductIds: Array<number> = checkedProducts?.map(
    ({ productId }) => productId
  );

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
        query: GET_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetProductsBySeller",
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
        description: "??????????????? ??????????????????.",
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
            {checkedProductIds.length}??? ????????? ??????????????? <br />
            ????????? ?????????????????????????
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
                  description: "??????????????? ?????????????????????.",
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

                    checkedProductsVar([]);
                    checkAllBoxStatusVar(false);
                  },
                });
              }

              if (error) {
                loadingSpinnerVisibilityVar(false);
                showHasServerErrorModal(error, "???????????? ??????");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "???????????? ??????");
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
          B-MARKET??? ?????????????????? ???????????? ?????? ????????? ????????????B??? ?????????
          <br />
          ????????? ????????? ????????? ??? ?????? ???????????? ?????????.
          <br />
          B??? ?????? ????????? ????????? ?????? ????????? B-MARKET ??????????????? ???????????????.
          <br />
          B??? ????????? ?????? ????????? ???????????? ????????? ???????????? ??????????????????.
        </NoticeContainer>
      ),
    });
  };

  useEffect(() => {
    const categories: Array<CategoriesType> =
      data?.getCategories.categories || [];
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
      <Title>???????????? ????????????</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"291px"}>
        ?????? ?????? ?????? ??? ??????????????? ?????? ???????????????.
      </NoticeContainer>

      <BmarketContainer>
        <CheckBox onChange={handleCheckBoxChange} checked={isBmarketChecked} />
        <Description>??? ????????? B-MARKET ???????????????</Description>
        <NoticeIcon src={questionMarkIconSrc} onClick={showNoticeClick} />

        {detailNotice.isVisible && (
          <DetailNoticeLayer>{detailNotice.component}</DetailNoticeLayer>
        )}
      </BmarketContainer>
      <DropdownContainer>
        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
          <StyledDropdown
            sizing={"medium"}
            width={"160px"}
            arrowSrc={downwordArrowBig}
            {...register(CATEGORY_FIRST)}
            value={watch(CATEGORY_FIRST) as string}
          >
            {[
              {
                name: "???????????? ??????????????????",
                value: "DEFAULT",
              },
              ...categoryDepthFirst.map((value: string) => ({
                name: value,
                value,
              })),
            ].map(({ value, name }) => (
              <Option key={value} value={value}>
                {value === "DEFAULT" ? name : CATEGORY_NAMES[name]}
              </Option>
            ))}
          </StyledDropdown>
        </DropdownWrapper>
        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
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
                name: "???????????? ??????????????????",
                value: "DEFAULT",
              },
              ...categoryDepthSecond.map((value: string) => ({
                name: value,
                value,
              })),
            ].map(({ value, name }) => (
              <Option key={value} value={value}>
                {value === "DEFAULT" ? name : CATEGORY_NAMES[name]}
              </Option>
            ))}
          </StyledDropdown>
        </DropdownWrapper>
        <DropdownWrapper>
          <DropdownLabel>?????????</DropdownLabel>
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
                name: "???????????? ??????????????????",
                value: "DEFAULT",
              },
              ...categoryDepthThird.map((value) => ({
                name: value,
                value: value,
              })),
            ].map(({ value, name }) => (
              <Option key={value} value={name}>
                {value === "DEFAULT" ? name : CATEGORY_NAMES[name]}
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
          ??????
        </StyledButton>
        <Button size={"small"} onClick={handleCloseButtonClick}>
          ??????
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
