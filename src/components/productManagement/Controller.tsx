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
    if (value === "???????????? ??????") return;

    const saleStatus = {
      DEFAULT: "???????????? ??????",
      ON_SALE: "?????????",
      STOP_SALE: "??????",
      SOLD_OUT: "??????",
    };

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          ???????????? ?????????
          <br />
          {saleStatus[value] === "?????????" && "??????????????? ?????????????????????????"}
          {saleStatus[value] === "??????" && "???????????? ?????????????????????????"}
          {saleStatus[value] === "??????" && "????????? ?????????????????????????"}
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
                    {saleStatus[value] === "?????????" &&
                      "??????????????? ?????????????????????."}
                    {saleStatus[value] === "??????" && "???????????? ?????????????????????."}
                    {saleStatus[value] === "??????" && "????????? ?????????????????????."}
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
              showHasServerErrorModal(error, "???????????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "???????????? ??????");
        }
      },
    });
  };

  const handleSaleStatusClick = () => {
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          ???????????? ????????? ?????????
          <br />
          ????????? ????????? ?????????
          <br />
          ???????????? ????????? ???????????????.
        </>
      );
      return;
    }
  };

  const handleChangeCategoryModalButtonClick = () => {
    if (!checkedProducts.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          ???????????? ????????? ?????????
          <br />
          ????????? ????????? ?????????
          <br />
          ????????? ???????????????.
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
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          ???????????? ????????? ?????????
          <br />
          ?????? ?????????????????????
          <br />
          ???????????? ?????????????????? ????????????.
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
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (hasTemporarySaveProduct !== -1) {
      showHasAnyProblemModal(
        <>
          ???????????? ????????? ?????????
          <br />
          ????????? ????????? ?????????
          <br />
          ????????? ???????????????.
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>????????? ?????????????????????????</>,
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
                description: <>????????? ?????????????????????.</>,
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
              showHasServerErrorModal(error, "?????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "?????? ??????");
        }
      },
    });
  };

  const handleDeleteButtonClick = () => {
    if (!checkedProductIds.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>????????? ?????????????????????????</>,
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
                description: <>????????? ?????????????????????.</>,
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
              showHasServerErrorModal(error, "?????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "?????? ??????");
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
            ???????????? ??????
          </Option>
          <Option value={"ON_SALE"}>?????????</Option>
          <Option value={"STOP_SALE"}>??????</Option>
          <Option value={"SOLD_OUT"}>??????</Option>
        </StatusDropDown>
        <ControllerButton
          size="small"
          onClick={handleChangeCategoryModalButtonClick}
        >
          ???????????? ??????
        </ControllerButton>
        <ControllerButton
          size="small"
          onClick={handleChangeDiscountModalButtonClick}
        >
          ????????? ??????
        </ControllerButton>
        <ControllerButton size="small" onClick={handleDuplicateButtonClick}>
          ??????
        </ControllerButton>
        <ControllerButton size="small" onClick={handleDeleteButtonClick}>
          ??????
        </ControllerButton>
      </ActiveButtonContainer>
      <SkipQuantityContainer>
        <SearchQueryInput
          value={temporaryQuery}
          onChange={changeFilterQueryHandler}
          placeholder={"?????????"}
        />

        <StatusDropDown
          onChange={changeSkipQuantityHandler}
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
        >
          <Option value={20}>20????????????</Option>
          <Option value={50}>50????????????</Option>
          <Option value={100}>100????????????</Option>
        </StatusDropDown>
        <ExportToExcelWrapper>
          <ExportToExcelButton
            tableData={tableData}
            exportData={checkedProducts}
          >
            ????????????
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
