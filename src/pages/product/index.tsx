import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";

import {
  GET_ALL_PRODUCTS_BY_SELLER,
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  selectedProductListVar,
  checkAllBoxStatusVar,
  pageNumberListVar,
  filterOptionSkipQuantityVar,
  filterOptionStatusVar,
  filterOptionQueryVar,
  showHasServerErrorModal,
  filterOptionPageNumberVar,
} from "@cache/ProductManagement";

import { systemModalVar } from "@cache/index";
import { getProductBySellerVar } from "@cache/ProductManagement";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Checkbox from "@components/common/input/Checkbox";
import FilterBar from "@components/ProductRegistration/ProductManagement/FilterBar";
import Pagination from "@components/ProductRegistration/ProductManagement/Pagination";
import Controller from "@components/ProductRegistration/ProductManagement/Controller";
import NoDataContainer from "@components/common/table/NoDataContainer";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import {
  ChangeProductsInfoInputType,
  ChangeProductsInfoType,
  CHANGE_PRODUCTS_INFO,
} from "@graphql/mutations/changeProductsInfo";
import { tableData } from "@cache/ProductManagement/table";
import {
  ThContainer,
  Th,
  TbContainer,
  Tr,
  Td,
} from "@components/common/table/Table";

const saleStatusList = [
  { id: 0, label: "DEFAULT", name: "판매상태 변경" },
  { id: 1, label: "ON_SALE", name: "판매중" },
  { id: 2, label: "STOP_SALE", name: "숨김" },
  { id: 3, label: "SOLD_OUT", name: "품절" },
];

const Product = () => {
  const productList = useReactiveVar(getProductBySellerVar);

  const selectedProductList: Array<ProductsListVarType> = useReactiveVar(
    selectedProductListVar
  );

  const filterOptionPageNumber: number = useReactiveVar(
    filterOptionPageNumberVar
  );

  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );

  const filterOptionSkipQuantity: number = useReactiveVar(
    filterOptionSkipQuantityVar
  );

  const filterOptionQuery = useReactiveVar(filterOptionQueryVar);

  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

  const [getProductList, { loading }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: filterOptionPageNumber,
        skip: filterOptionSkipQuantity,
        status: filterOptionStatus,
        query: filterOptionQuery,
      },
    },
    fetchPolicy: "no-cache",
  });

  const [updateProductsStatus] = useMutation<
    ChangeProductsInfoType,
    ChangeProductsInfoInputType
  >(CHANGE_PRODUCTS_INFO, {
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: {
          input: {
            page: filterOptionPageNumber,
            skip: filterOptionSkipQuantity,
            status: filterOptionStatus,
            query: filterOptionQuery,
          },
        },
      },
      "GetAllProductsBySeller",
    ],
    fetchPolicy: "no-cache",
  });

  // 단일 상태 변경
  const changeSingleSaleStatusHandler =
    (id: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const saleStatus = {
        ON_SALE: "판매중",
        STOP_SALE: "숨김",
        SOLD_OUT: "품절",
      };

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
            {saleStatus[value] === "판매중" && "판매중으로 변경하시겠습니까?"}
            {saleStatus[value] === "숨김" && "숨김으로 변경하시겠습니까?"}
            {saleStatus[value] === "품절" && "품절로 변경하시겠습니까?"}
          </>
        ),
        confirmButtonClickHandler: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            const {
              data: {
                changeProductsInfo: { ok, error },
              },
            } = await updateProductsStatus({
              variables: {
                input: {
                  productIds: [id],
                  productStatus: value,
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
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,
                  description: (
                    <>
                      {saleStatus[value] === "판매중" &&
                        "판매중으로 변경되었습니다."}
                      {saleStatus[value] === "숨김" &&
                        "숨김으로 변경되었습니다."}
                      {saleStatus[value] === "품절" && "품절로 변경되었습니다."}
                    </>
                  ),

                  confirmButtonClickHandler: () => {
                    getProductBySellerVar(
                      products.map((list) => ({ ...list, isChecked: false }))
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
                showHasServerErrorModal(refetchError);
              }
            }

            if (error) {
              showHasServerErrorModal(error);
            }
          })();
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    };

  // 복수 체크박스
  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      const checkAllProductList = productList.map((product) => ({
        ...product,
        isChecked: true,
      }));

      getProductBySellerVar(checkAllProductList);
      selectedProductListVar(checkAllProductList);
    }

    if (!e.target.checked) {
      const checkAllProductList = productList.map((product) => ({
        ...product,
        isChecked: false,
      }));

      getProductBySellerVar(checkAllProductList);
      selectedProductListVar([]);
    }
  };

  // 단일 체크박스
  const changeSingleCheckBoxHandler =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const checkedProductList = { ...productList[index], isChecked: true };
        selectedProductListVar([...selectedProductList, checkedProductList]);

        productList[index].isChecked = true;
        getProductBySellerVar(productList);
      }

      if (!e.target.checked) {
        const newProductList = [...productList];
        const isCheckedList = selectedProductList.filter(
          (product) => product.id === productList[index].id
        );

        if (isCheckedList) {
          const checkedListIndex = selectedProductList.findIndex(
            (product) => product.id === productList[index].id
          );

          selectedProductListVar([
            ...selectedProductList.slice(0, checkedListIndex),
            ...selectedProductList.slice(checkedListIndex + 1),
          ]);

          newProductList[index].isChecked = false;
          getProductBySellerVar(productList);
        }

        if (!isCheckedList) {
          const checkedProductList = {
            ...productList[index],
            isChecked: false,
          };

          selectedProductListVar([...selectedProductList, checkedProductList]);

          newProductList[index].isChecked = false;
          getProductBySellerVar(productList);
        }
      }
    };

  // 필터 업데이트
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const {
        data: {
          getAllProductsBySeller: { products, ok, error, totalPages },
        },
      } = await getProductList();

      pageNumberListVar(
        Array(totalPages)
          .fill(null)
          .map((_, index) => index + 1)
      );

      if (ok) {
        getProductBySellerVar(
          products.map((list) => ({
            ...list,
            isChecked: false,
          }))
        );

        selectedProductListVar([]);
        checkAllBoxStatusVar(false);
      }

      if (error) {
        showHasServerErrorModal(error);
      }
    })();
  }, [
    filterOptionStatus,
    filterOptionSkipQuantity,
    filterOptionQuery,
    filterOptionPageNumber,
  ]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리" />
        <FilterBar />
        <ProductManagerContainer>
          <Controller />
          <ProductListTable>
            <ThContainer>
              {tableData.map(({ id, label, width, className }) => (
                <Th key={id} width={width} className={className}>
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
            {productList.length ? (
              <TbContainer>
                {productList?.map(
                  (
                    {
                      id,
                      name,
                      category,
                      originalPrice,
                      discountAmount,
                      quantity,
                      status,
                      thumbnail,
                      isChecked,
                    },
                    index
                  ) => {
                    // const discountAppliedPriceToWonSign = discountAppliedPrice
                    //   ? `${discountAppliedPrice.toLocaleString("ko-KR")} ₩`
                    //   : "-";

                    const firstCategory = category?.parent?.name
                      ? category.parent.name
                      : "-";
                    const secondCategory = category?.name ? category.name : "-";
                    const thirdCategory = category?.children?.name
                      ? category.children.name
                      : "-";

                    const rateOfDiscount =
                      discountMethod && discountAmount
                        ? `${discountAmount.toLocaleString("ko-KR")} ${
                            discountMethod === "PERCENT" ? "%" : "₩"
                          }`
                        : "-";

                    const originalPriceToWonSign = `${originalPrice.toLocaleString(
                      "ko-KR"
                    )} ₩`;

                    return (
                      <Tr key={id}>
                        <ProductManageMentTd
                          width={tableData[0].width}
                          className={tableData[0].className}
                        >
                          <Checkbox
                            onChange={changeSingleCheckBoxHandler(index)}
                            checked={isChecked}
                          />
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[1].width}
                          className={tableData[1].className}
                        >
                          {id}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[2].width}
                          className={tableData[2].className}
                        >
                          <ProductThumbNailWrapper>
                            <ProductThumbNail src={thumbnail} />
                          </ProductThumbNailWrapper>
                          <ProductName>
                            <Link
                              to={`/product/${id}`}
                              state={{ productId: id }}
                            >
                              {name}
                            </Link>
                          </ProductName>
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[3].width}
                          className={tableData[3].className}
                        >
                          {firstCategory}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[4].width}
                          className={tableData[4].className}
                        >
                          {secondCategory}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[5].width}
                          className={tableData[5].className}
                        >
                          {thirdCategory}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[6].width}
                          className={tableData[6].className}
                        >
                          {originalPriceToWonSign}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[7].width}
                          className={tableData[7].className}
                        >
                          {rateOfDiscount}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[8].width}
                          className={tableData[8].className}
                        >
                          {/* {discountAppliedPriceToWonSign} */}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[9].width}
                          className={tableData[9].className}
                        >
                          {quantity}
                        </ProductManageMentTd>
                        <ProductManageMentTd
                          width={tableData[10].width}
                          className={tableData[10].className}
                        >
                          <Dropdown
                            onChange={changeSingleSaleStatusHandler(id)}
                            arrowSrc={triangleArrowSvg}
                            value={status}
                            sizing={"medium"}
                            width={"146px"}
                          >
                            {saleStatusList.map(({ id, label, name }) => (
                              <Option
                                key={id}
                                value={label}
                                hidden={label === "DEFAULT"}
                              >
                                {name}
                              </Option>
                            ))}
                          </Dropdown>
                        </ProductManageMentTd>
                      </Tr>
                    );
                  }
                )}
              </TbContainer>
            ) : (
              !loading && (
                <NoDataContainer>
                  검색어와 일치하는
                  <br />
                  상품이 없습니다.
                </NoDataContainer>
              )
            )}
          </ProductListTable>

          {productList.length ? <Pagination /> : <></>}
        </ProductManagerContainer>
      </ContentsContainer>
    </Layout>
  );
};

const ProductManagerContainer = styled.div`
  flex: 1 1 0;
`;

const ProductListTable = styled.div`
  width: 100%;
`;

const ProductManageMentTd = styled(Td)`
  &.name {
    justify-content: flex-start;
  }
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

export default Product;
