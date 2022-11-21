import React, { useEffect } from "react";
import styled from "styled-components";

import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
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
  LoadingSpinnerVisivilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";

import {
  getProductBySellerVar,
  ProductsListVarType,
  selectedProductListVar,
  showHasCheckedAnyProductModal,
  showHasServerErrorModal,
} from "@cache/productManagement";

import {
  temporaryQueryVar,
  checkAllBoxStatusVar,
  filterOptionVar,
} from "@cache/index";

import {
  GetAllProductsBySellerInputType,
  GetAllProductsBySellerType,
  GET_ALL_PRODUCTS_BY_SELLER,
} from "@graphql/queries/getAllProductsBySeller";
import ChangeCategoryModal from "./ChangeCategoryModal";
import ChangeDiscountModal from "./ChangeDiscountModal";
import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";

import { Input as SearchInput } from "@components/common/input/SearchInput";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

const Controller = () => {
  const filterOption = useReactiveVar(filterOptionVar);

  const selectedProductList: Array<ProductsListVarType> = useReactiveVar(
    selectedProductListVar
  );

  const selectedProductListIds: Array<number> = selectedProductList.map(
    (list) => list.id
  );

  const temporaryQuery = useReactiveVar(temporaryQueryVar);

  const [getProductList] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: filterOption,
    },
    fetchPolicy: "no-cache",
  });

  const [updateProductsStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
  });

  const [deleteProducts] = useMutation<
    DeleteProductsBySeller,
    DeleteProductsBySellerInputType
  >(DELETE_PRODUCTS_BY_SELLER, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
  });

  const [duplicateProducts] = useMutation<
    DuplicateProductsBySellerType,
    DuplicateProductsBySellerInputType
  >(DUPLICATE_PRODUCTS_BY_SELLER, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: filterOption,
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
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
          LoadingSpinnerVisivilityVar(true);
          const {
            data: {
              changeProductsInfoBySeller: { ok, error },
            },
          } = await updateProductsStatus({
            variables: {
              input: {
                productIds: selectedProductListIds,
                productStatus: value,
              },
            },
          });

          if (ok) {
            LoadingSpinnerVisivilityVar(false);
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
                  getProductBySellerVar(
                    products.map((list) => ({ ...list, isChecked: false }))
                  );

                  e.target.value = saleStatus["DEFAULT"];
                  checkAllBoxStatusVar(false);
                  selectedProductListVar([]);

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }

            if (refetchError) {
              showHasServerErrorModal(refetchError);
              LoadingSpinnerVisivilityVar(false);
            }
          }

          if (error) {
            showHasServerErrorModal(error);
            LoadingSpinnerVisivilityVar(false);
          }
        })();
      },
    });
  };

  const handleSaleStatusClick = () => {
    if (!selectedProductList.length) {
      showHasCheckedAnyProductModal();
      return;
    }
  };

  // 카테고리 변경 모달
  const handleChangeCategoryModalButtonClick = () => {
    if (!selectedProductList.length) {
      showHasCheckedAnyProductModal();
      return;
    }

    modalVar({
      isVisible: true,
      component: <ChangeCategoryModal />,
    });
  };

  // 할인율 변경 모달
  const handleChangeDiscountModalButtonClick = () => {
    if (!selectedProductList.length) {
      showHasCheckedAnyProductModal();
      return;
    }

    modalVar({
      isVisible: true,
      component: <ChangeDiscountModal />,
    });
  };

  // 복제
  const handleDuplicateButtonClick = () => {
    if (!selectedProductList.length) {
      showHasCheckedAnyProductModal();
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
          LoadingSpinnerVisivilityVar(true);
          const {
            data: {
              duplicateProductsBySeller: { ok, error },
            },
          } = await duplicateProducts({
            variables: {
              input: {
                productIds: selectedProductListIds,
              },
            },
          });

          if (ok) {
            LoadingSpinnerVisivilityVar(false);
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
                description: <>상품이 복제되었습니다.</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  getProductBySellerVar(
                    products.map((list) => ({
                      ...list,
                      isChecked: false,
                    }))
                  );

                  checkAllBoxStatusVar(false);
                  selectedProductListVar([]);

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }

            if (refetchError) {
              LoadingSpinnerVisivilityVar(false);
              showHasServerErrorModal(refetchError);
            }
          }

          if (error) {
            LoadingSpinnerVisivilityVar(false);
            showHasServerErrorModal(error);
          }
        })();
      },
    });
  };

  // 삭제
  const handleDeleteButtonClick = () => {
    if (!selectedProductList.length) {
      showHasCheckedAnyProductModal();
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
          LoadingSpinnerVisivilityVar(true);
          const {
            data: {
              deleteProductsBySeller: { ok, error },
            },
          } = await deleteProducts({
            variables: {
              input: {
                productIds: selectedProductListIds,
              },
            },
          });

          if (ok) {
            LoadingSpinnerVisivilityVar(false);
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
                description: <>상품이 삭제되었습니다.</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  getProductBySellerVar(
                    products.map((list) => ({
                      ...list,
                      isChecked: false,
                    }))
                  );

                  checkAllBoxStatusVar(false);
                  selectedProductListVar([]);

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }

            if (refetchError) {
              LoadingSpinnerVisivilityVar(false);
              showHasServerErrorModal(error);
            }
          }

          if (error) {
            LoadingSpinnerVisivilityVar(false);
            showHasServerErrorModal(error);
          }
        })();
      },
    });
  };

  // 필터 임시 쿼리
  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    temporaryQueryVar(e.target.value);
  };

  // 필터 쿼리
  const changeSkipQuantityHandler = ({ target: { value } }) => {
    filterOptionVar({
      ...filterOption,
      skip: Number(value),
    });
  };

  // 디바운스
  useEffect(() => {
    const debounce = setTimeout(() => {
      return filterOptionVar({ ...filterOption, query: temporaryQuery });
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
