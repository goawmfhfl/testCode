import React, { useEffect } from "react";
import styled from "styled-components";

import { useMutation, useReactiveVar } from "@apollo/client";
import {
  ChangeProductsInfoBySellerInputType,
  ChangeProductsInfoBySellerType,
  CHANGE_PRODUCTS_INFO_BY_SELLER,
} from "@graphql/mutations/changeProductsInfoBySeller";
import {
  DeleteProductsBySeller,
  DeleteProductsBySellerInputType,
  DELETE_PRODUCTS_BY_SELLER,
} from "@graphql/mutations/deleteProductsBySeller";
import {
  DuplicateProductsBySellerInputType,
  DuplicateProductsBySellerType,
  DUPLICATE_PRODUCTS_BY_SELLER,
} from "@graphql/mutations/duplicateProductsBySeller";

import {
  checkedProductIdsVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  paginationSkipVar,
  systemModalVar,
  showHasCheckedAnyCheckBoxModal,
  temporaryQueryVar,
  checkAllBoxStatusVar,
} from "@cache/index";

import {
  showHasServerErrorModal,
  filterOptionVar,
} from "@cache/productManagement";

import { GET_ALL_PRODUCTS_BY_SELLER } from "@graphql/queries/getAllProductsBySeller";
import ChangeCategoryModal from "@components/productManagement/ChangeCategoryModal";
import ChangeDiscountModal from "@components/productManagement/ChangeDiscountModal";
import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import { Input as SearchInput } from "@components/common/input/SearchInput";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { status } = useReactiveVar(filterOptionVar);

  const checkedProductIds = useReactiveVar(checkedProductIdsVar);
  const temporaryQuery = useReactiveVar(temporaryQueryVar);

  const [updateProductsStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetAllProductsBySeller",
    ],
  });

  const [deleteProducts] = useMutation<
    DeleteProductsBySeller,
    DeleteProductsBySellerInputType
  >(DELETE_PRODUCTS_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetAllProductsBySeller",
    ],
  });

  const [duplicateProducts] = useMutation<
    DuplicateProductsBySellerType,
    DuplicateProductsBySellerInputType
  >(DUPLICATE_PRODUCTS_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetAllProductsBySeller",
    ],
  });

  const changeMultiSaleStatusHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (value === "판매상태 변경") return;

    const saleStatus = {
      DEFAULT: "판매상태 변경",
      ON_SALE: "판매중",
      STOP_SALE: "숨김",
      SOLD_OUT: "품절",
    };

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          선택하신 상품을
          <br />
          {saleStatus[value] === "판매중" && "판매중으로 변경하시겠습니까?"}
          {saleStatus[value] === "숨김" && "숨김으로 변경하시겠습니까?"}
          {saleStatus[value] === "품절" && "품절로 변경하시겠습니까?"}
        </>
      ),
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          loadingSpinnerVisibilityVar(true);
          const {
            data: {
              changeProductsInfoBySeller: { ok, error },
            },
          } = await updateProductsStatus({
            variables: {
              input: {
                productIds: checkedProductIds,
                productStatus: value,
              },
            },
          });

          if (ok) {
            loadingSpinnerVisibilityVar(false);
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: (
                <>
                  {saleStatus[value] === "판매중" &&
                    "판매중으로 변경되었습니다."}
                  {saleStatus[value] === "숨김" && "숨김으로 변경되었습니다."}
                  {saleStatus[value] === "품절" && "품절로 변경되었습니다."}
                </>
              ),
              cancelButtonVisibility: false,

              confirmButtonClickHandler: () => {
                e.target.value = saleStatus["DEFAULT"];
                checkAllBoxStatusVar(false);
                checkedProductIdsVar([]);

                systemModalVar({
                  ...systemModalVar(),
                  isVisible: false,
                });
              },
            });
          }

          if (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error, "판매상태 변경");
          }
        })();
      },
    });
  };

  const handleSaleStatusClick = () => {
    if (!checkedProductIds.length) {
      showHasCheckedAnyCheckBoxModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }
  };

  const handleChangeCategoryModalButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasCheckedAnyCheckBoxModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    modalVar({
      isVisible: true,
      component: <ChangeCategoryModal />,
    });
  };

  const handleChangeDiscountModalButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasCheckedAnyCheckBoxModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    modalVar({
      isVisible: true,
      component: <ChangeDiscountModal />,
    });
  };

  const handleDuplicateButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasCheckedAnyCheckBoxModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>상품을 복제하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,

      confirmButtonClickHandler: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          loadingSpinnerVisibilityVar(true);
          const {
            data: {
              duplicateProductsBySeller: { ok, error },
            },
          } = await duplicateProducts({
            variables: {
              input: {
                productIds: checkedProductIds,
              },
            },
          });

          if (ok) {
            loadingSpinnerVisibilityVar(false);
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: <>상품이 복제되었습니다.</>,
              confirmButtonVisibility: true,
              cancelButtonVisibility: false,

              confirmButtonClickHandler: () => {
                checkAllBoxStatusVar(false);
                checkedProductIdsVar([]);

                systemModalVar({
                  ...systemModalVar(),
                  isVisible: false,
                });
              },
            });
          }

          if (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error, "상품 복제");
          }
        })();
      },
    });
  };

  const handleDeleteButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasCheckedAnyCheckBoxModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>상품을 삭제하시겠습니까?</>,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,

      confirmButtonClickHandler: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          loadingSpinnerVisibilityVar(true);
          const {
            data: {
              deleteProductsBySeller: { ok, error },
            },
          } = await deleteProducts({
            variables: {
              input: {
                productIds: checkedProductIds,
              },
            },
          });

          if (ok) {
            loadingSpinnerVisibilityVar(false);
            systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: <>상품이 삭제되었습니다.</>,
              confirmButtonVisibility: true,
              cancelButtonVisibility: false,

              confirmButtonClickHandler: () => {
                checkAllBoxStatusVar(false);
                checkedProductIdsVar([]);

                systemModalVar({
                  ...systemModalVar(),
                  isVisible: false,
                });
              },
            });
          }

          if (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error, "상품 삭제");
          }
        })();
      },
    });
  };

  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    temporaryQueryVar(e.target.value);
  };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
      skip: Number(value),
    });
    paginationSkipVar(0);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return commonFilterOptionVar({
        ...commonFilterOptionVar(),
        query: temporaryQuery,
      });
    }, 500);

    return () => clearTimeout(debounce);
  }, [temporaryQuery]);

  return (
    <Container>
      <ActiveButtonContainer>
        <StatusDropDown
          onChange={changeMultiSaleStatusHandler}
          onClick={handleSaleStatusClick}
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={"DEFAULT"}
        >
          <Option value={"DEFAULT"} disabled hidden>
            판매상태 변경
          </Option>
          <Option value={"ON_SALE"}>판매중</Option>
          <Option value={"STOP_SALE"}>숨김</Option>
          <Option value={"SOLD_OUT"}>품절</Option>
        </StatusDropDown>
        <ControllerButton
          size="small"
          onClick={handleChangeCategoryModalButtonClick}
        >
          카테고리 변경
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleChangeDiscountModalButtonClick}
        >
          할인율 변경
        </ControllerButton>
        <ControllerButton size="small" onClick={handleDuplicateButtonClick}>
          복제
        </ControllerButton>
        <ControllerButton size="small" onClick={handleDeleteButtonClick}>
          삭제
        </ControllerButton>
      </ActiveButtonContainer>
      <SkipQuantityContainer>
        <SearchQueryInput
          value={temporaryQuery}
          onChange={changeFilterQueryHandler}
          placeholder={"상품명"}
        />

        <StatusDropDown
          onChange={changeSkipQuantityHandler}
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
        >
          <Option value={20}>20개씩보기</Option>
          <Option value={50}>50개씩보기</Option>
          <Option value={100}>100개씩보기</Option>
        </StatusDropDown>
      </SkipQuantityContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px;
  background-color: ${({ theme: { palette } }) => palette.white};
  white-space: nowrap;
`;

const ActiveButtonContainer = styled.div`
  display: flex;
`;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const StatusDropDown = styled(Dropdown)`
  padding-right: 0px;
`;

const ControllerButton = styled(Button)`
  margin-left: 12px;
`;

const SkipQuantityContainer = styled.div`
  display: flex;
`;

export default Controller;
