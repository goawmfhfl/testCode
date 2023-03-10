import React, { useEffect } from "react";
import styled from "styled-components/macro";

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
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  paginationSkipVar,
  systemModalVar,
  showHasAnyProblemModal,
  temporaryQueryVar,
  checkAllBoxStatusVar,
} from "@cache/index";

import {
  showHasServerErrorModal,
  filterOptionVar,
  checkedProductsVar,
} from "@cache/productManagement";

import { ProductStatus } from "@constants/product";
import { tableData } from "@constants/product/table";
import { GET_PRODUCTS_BY_SELLER } from "@graphql/queries/getProductsBySeller";
import { CaculatedProductsType } from "@models/product/management";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import ExportToExcelButton from "@components/productManagement/ExportToExcelButton";
import ChangeCategoryModal from "@components/productManagement/ChangeCategoryModal";
import ChangeDiscountModal from "@components/productManagement/ChangeDiscountModal";
import Button from "@components/common/Button";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { status } = useReactiveVar(filterOptionVar);

  const checkedProducts: Array<CaculatedProductsType> =
    useReactiveVar(checkedProductsVar);

  const checkedProductIds: Array<number> = checkedProducts?.map(
    ({ productId }) => productId
  );

  const hasTemporarySaveProduct = checkedProducts.findIndex(
    ({ status }) => status === ProductStatus.TEMPORARY
  );

  const temporaryQuery = useReactiveVar(temporaryQueryVar);

  const [updateProductsStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetProductsBySeller",
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
        query: GET_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetProductsBySeller",
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
        query: GET_PRODUCTS_BY_SELLER,
        variables: {
          input: { page, skip, status, query },
        },
      },
      "GetProductsBySeller",
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
        try {
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
                  checkedProductsVar([]);

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
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "판매상태 변경");
        }
      },
    });
  };

  const handleSaleStatusClick = () => {
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          임시저장 상태의 상품은
          <br />
          상품이 등록된 후부터
          <br />
          판매상태 변경이 가능합니다.
        </>
      );
      return;
    }
  };

  const handleChangeCategoryModalButtonClick = () => {
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          임시저장 상태의 상품은
          <br />
          상품이 등록된 후부터
          <br />
          복제가 가능합니다.
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
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          임시저장 상태의 상품은
          <br />
          상품 수정페이지에서
          <br />
          할인율을 변경해주시기 바랍니다.
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
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          임시저장 상태의 상품은
          <br />
          상품이 등록된 후부터
          <br />
          복제가 가능합니다.
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
        try {
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
                  checkedProductsVar([]);

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
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "상품 복제");
        }
      },
    });
  };

  const handleDeleteButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasAnyProblemModal(
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
        try {
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
                  checkedProductsVar([]);

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
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "상품 삭제");
        }
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
        <ExportToExcelWrapper>
          <ExportToExcelButton
            tableData={tableData}
            exportData={checkedProducts}
          >
            내보내기
          </ExportToExcelButton>
        </ExportToExcelWrapper>
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

const ExportToExcelWrapper = styled.div`
  margin-left: 12px;
`;

export default Controller;
