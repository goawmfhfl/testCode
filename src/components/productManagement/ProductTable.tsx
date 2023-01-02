import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  checkedProductsVar,
  filterOptionVar,
  showHasServerErrorModal,
} from "@cache/productManagement";
import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  systemModalVar,
  pageNumberListVar,
  paginationVisibilityVar,
  totalPageLengthVar,
} from "@cache/index";
import { tableData } from "@constants/product/table";
import { ProductStatus, productStatus, productType } from "@constants/product";
import {
  GET_PRODUCTS_BY_SELLER,
  ProductsType,
} from "@graphql/queries/getProductsBySeller";
import {
  ChangeProductsInfoBySellerInputType,
  ChangeProductsInfoBySellerType,
  CHANGE_PRODUCTS_INFO_BY_SELLER,
} from "@graphql/mutations/changeProductsInfoBySeller";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import { TableType } from "@models/index";
import useLazyProducts from "@hooks/product/useLazyGetProducts";
import {
  ThContainer,
  Th,
  TdContainer,
  Tr,
  Td,
  TableContainer,
} from "@components/common/table/Table";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Checkbox from "@components/common/input/Checkbox";
import NoDataContainer from "@components/common/table/NoDataContainer";
import Loading from "@components/common/table/Loading";
import contructProducts from "@utils/product/management/constructProducts";
import {
  NormalizedType,
  CaculatedProductsType,
} from "@models/product/management";
import { caculateProducts } from "@utils/product/management/caculateProducts";

const ProductTable = () => {
  const { loading, error, data, getProducts } = useLazyProducts();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { status } = useReactiveVar(filterOptionVar);

  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);
  const checkedProducts: Array<CaculatedProductsType> =
    useReactiveVar(checkedProductsVar);

  const [products, setProducts] = useState<Array<CaculatedProductsType>>([]);

  const [changeProductStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    refetchQueries: [
      {
        query: GET_PRODUCTS_BY_SELLER,
        variables: { input: { page, skip, status, query } },
      },
      "GetProductsBySeller",
    ],
  });

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProducts = [...products];
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkAllProductList = newProducts.map((product) => ({
        ...product,
        isChecked: true,
      }));

      setProducts(checkAllProductList);
      checkedProductsVar(checkAllProductList);
    }

    if (!e.target.checked) {
      const checkAllProductList = newProducts.map((product) => ({
        ...product,
        isChecked: false,
      }));

      setProducts(checkAllProductList);
      checkedProductsVar([]);
      checkAllBoxStatusVar(false);
    }
  };

  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newProducts = [...products];

      if (e.target.checked) {
        const checkedProductList = { ...newProducts[index], isChecked: true };
        checkedProductsVar([...checkedProducts, checkedProductList]);

        newProducts[index].isChecked = true;
        setProducts(newProducts);
      }

      if (!e.target.checked) {
        const hasCheckedList = checkedProducts.filter(
          (product) => product.productId === newProducts[index].productId
        );

        if (hasCheckedList) {
          const checkedListIndex = checkedProducts.findIndex(
            (product) => product.productId === newProducts[index].productId
          );

          const deletedCheckedList = [
            ...checkedProducts.slice(0, checkedListIndex),
            ...checkedProducts.slice(checkedListIndex + 1),
          ];

          checkedProductsVar(deletedCheckedList);

          newProducts[index].isChecked = false;

          setProducts(newProducts);
        }

        newProducts[index].isChecked = false;
        setProducts(newProducts);
      }
    };

  const changeSingleSaleStatusHandler =
    (id: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        description: (
          <>
            선택하신 상품을
            <br />
            {productType[value] === productType.ON_SALE &&
              `${productType.ON_SALE}으로 변경하시겠습니까?`}
            {productType[value] === productType.STOP_SALE &&
              `${productType.STOP_SALE}으로 변경하시겠습니까?`}
            {productType[value] === productType.SOLD_OUT &&
              `${productType.SOLD_OUT}로 변경하시겠습니까?`}
          </>
        ),
        confirmButtonClickHandler: () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (async () => {
              loadingSpinnerVisibilityVar(true);

              const {
                data: {
                  changeProductsInfoBySeller: { ok, error },
                },
              } = await changeProductStatus({
                variables: {
                  input: {
                    productIds: [id],
                    productStatus: value,
                  },
                },
              });

              if (ok) {
                loadingSpinnerVisibilityVar(false);
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,
                  description: (
                    <>
                      {productType[value] === productType.ON_SALE &&
                        `${productType.ON_SALE}으로 변경되었습니다.`}
                      {productType[value] === productType.STOP_SALE &&
                        `${productType.STOP_SALE}으로 변경되었습니다.`}
                      {productType[value] === productType.SOLD_OUT &&
                        `${productType.SOLD_OUT}로 변경되었습니다.`}
                    </>
                  ),

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
                showHasServerErrorModal(error, "판매상태 변경");
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, "판매상태 변경");
          }
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getProducts({
        variables: { input: { page, skip, status, query } },
      });
    })();
  }, [page, skip, status, query]);

  useEffect(() => {
    if (!data || !data.getProductsBySeller) return;

    const {
      totalPages,
      totalResults,
      products,
    }: {
      totalPages: number;
      totalResults: number;
      products: Array<ProductsType>;
    } = data.getProductsBySeller;

    const isLastPageChanged = totalPages < page;

    if (isLastPageChanged && totalPages !== 0) {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: totalPages,
      });

      return;
    }

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );

    totalPageLengthVar(totalResults);

    const recontructProducts: NormalizedType = contructProducts(products);
    const caculatedProducts: Array<CaculatedProductsType> =
      caculateProducts(recontructProducts);
    setProducts(caculatedProducts);

    checkedProductsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading, error]);

  useEffect(() => {
    if (!query) {
      return;
    }

    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
    });
  }, [query]);

  useEffect(() => {
    if (error) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            내부 서버 오류로 인해 요청하신
            <br />
            작업을 완료하지 못했습니다.
            <br />
            다시 한 번 시도 후 같은 문제가 발생할 경우
            <br />
            찹스틱스로 문의해주세요.
            <br />
            <br />
            (전화 문의 070-4187-3848)
            <br />
            <br />
            code:
            {error.message}
          </>
        ),
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  }, [error]);

  const hasProducts = !!products && !!products.length;
  const isFetchingProductFailed = !!loading || !!error || hasProducts;

  return (
    <TableContainer type={TableType.FIX} hasData={isFetchingProductFailed}>
      <ThContainer>
        {tableData.map(({ id, label, width }) => (
          <Th key={`th-${id}`} width={width}>
            {label === "checkBox" ? (
              <Checkbox
                onChange={changeAllCheckBoxHandler}
                checked={checkAllBoxStatus}
              />
            ) : (
              label
            )}
          </Th>
        ))}
      </ThContainer>

      <TdContainer>
        {!loading &&
          products?.map(
            (
              {
                productId,
                thumbnail,
                productName,
                firstCategory,
                secondCategory,
                thirdCategory,
                originalPriceToWonSign,
                discountedRate,
                finalSellngPrice,
                quantity,
                status,
                isChecked,
              },
              index
            ) => {
              return (
                <Tr key={`product-${productId}-row`}>
                  <Td width={tableData[0].width}>
                    <Checkbox
                      onChange={changeSingleCheckBoxHandler(index)}
                      checked={isChecked}
                    />
                  </Td>
                  <Td width={tableData[1].width}>{productId}</Td>
                  <ProductNameTd width={tableData[2].width}>
                    <ProductThumbNailWrapper>
                      <ProductThumbNail src={thumbnail} />
                    </ProductThumbNailWrapper>
                    <ProductName>
                      <Link to={`/product/${productId}`}>{productName}</Link>
                    </ProductName>
                  </ProductNameTd>
                  <Td width={tableData[3].width}>{firstCategory}</Td>
                  <Td width={tableData[4].width}>{secondCategory}</Td>
                  <Td width={tableData[5].width}>{thirdCategory}</Td>
                  <Td width={tableData[6].width}>{originalPriceToWonSign}</Td>
                  <Td width={tableData[7].width}>{discountedRate}</Td>
                  <Td width={tableData[8].width}>{finalSellngPrice}</Td>
                  <Td width={tableData[9].width}>{quantity}</Td>
                  <Td width={tableData[10].width}>
                    <Dropdown
                      onChange={changeSingleSaleStatusHandler(productId)}
                      arrowSrc={triangleArrowSvg}
                      value={status}
                      sizing={"medium"}
                      width={"146px"}
                      disabled={status === ProductStatus.TEMPORARY}
                    >
                      {productStatus.map(({ label, value }) => (
                        <Option
                          key={`product-${productId}-status-${label}`}
                          value={value}
                          hidden={
                            value === ProductStatus.DEFAULT ||
                            value === ProductStatus.TEMPORARY
                          }
                        >
                          {label}
                        </Option>
                      ))}
                    </Dropdown>
                  </Td>
                </Tr>
              );
            }
          )}
      </TdContainer>

      {loading && <Loading type={TableType.FIX} />}

      {!hasProducts && (
        <NoDataContainer type={TableType.FIX}>
          {query && (
            <>
              검색어와 일치하는
              <br />
              상품이 없습니다.
            </>
          )}

          {!query && (
            <>
              아직 등록된
              <br />
              상품이 없습니다
            </>
          )}
        </NoDataContainer>
      )}
    </TableContainer>
  );
};

const ProductNameTd = styled(Td)`
  justify-content: flex-start;
`;

const ProductThumbNailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 56px;
  height: 40px;

  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const ProductThumbNail = styled.img`
  width: 24px;
  height: 24px;
`;

const ProductName = styled.span`
  display: block;

  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default ProductTable;
