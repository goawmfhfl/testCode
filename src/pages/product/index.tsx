import React, { useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  selectedProductListVar,
  checkAllBoxStatusVar,
  filterOptionSkipQuantityVar,
  filterOptionStatusVar,
  filterOptionQueryVar,
  temporaryQueryVar,
  showHasCheckedAnyProductModal,
  showHasServerErrorModal,
} from "@cache/ProductManagement";
import { modalVar, systemModalVar } from "@cache/index";
import {
  ProductsListVarType,
  getProductBySellerVar,
} from "@cache/ProductManagement";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Button from "@components/common/Button";
import Checkbox from "@components/common/input/Checkbox";
import FilterBar from "@components/ProductRegistration/ProductManagement/FilterBar";
import ChangeCategoryModal from "@components/ProductRegistration/ProductManagement/ChangeCategoryModal";
import ChangeDiscountModal from "@components/ProductRegistration/ProductManagement/ChangeDiscountModal";
import {
  ChangeProductsInfoInputType,
  ChangeProductsInfoType,
  CHANGE_PRODUCTS_INFO,
} from "@graphql/mutations/changeProductsInfo";
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

import mediumDoubleLeftSvg from "@icons/medium-double-left.svg";
import mediumDoubleRightSvg from "@icons/medium-double-right.svg";
import mediumLeftSvg from "@icons/medium-left.svg";
import mediumRightSvg from "@icons/medium-right.svg";

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

  const selectedProductListIds: Array<number> = selectedProductList.map(
    (list) => list.id
  );

  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );

  const filterOptionSkipQuantity: number = useReactiveVar(
    filterOptionSkipQuantityVar
  );

  const filterQuery = useReactiveVar(filterOptionQueryVar);
  const temporaryQuery = useReactiveVar(temporaryQueryVar);

  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

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

  const [deleteProducts] = useMutation<
    DeleteProductsBySeller,
    DeleteProductsBySellerInputType
  >(DELETE_PRODUCTS_BY_SELLER, {
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

  const [duplicateProducts] = useMutation<
    DuplicateProductsBySellerType,
    DuplicateProductsBySellerInputType
  >(DUPLICATE_PRODUCTS_BY_SELLER, {
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

  // 복수 상태 변경
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
          const {
            data: {
              changeProductsInfo: { ok, error },
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
            }
          }

          if (error) {
            showHasServerErrorModal(error);
          }
        })();
      },
    });
  };

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

  // 단일 상태 방지
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
              showHasServerErrorModal(refetchError);
            }
          }

          if (error) {
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
              showHasServerErrorModal(error);
            }
          }

          if (error) {
            showHasServerErrorModal(error);
          }
        })();
      },
    });
  };

  // 체크박스 All
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

  // 체크박스 Single
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

  // 필터 임시 쿼리
  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    temporaryQueryVar(e.target.value);
  };

  // 필터 쿼리
  const changeSkipQuantityHandler = ({ target: { value } }) => {
    filterOptionSkipQuantityVar(Number(value));
  };

  // 디바운스
  useEffect(() => {
    const debounce = setTimeout(() => {
      return filterOptionQueryVar(temporaryQuery);
    }, 500);

    return () => clearTimeout(debounce);
  }, [temporaryQuery]);

  // 필터 업데이트
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const {
        data: {
          getAllProductsBySeller: { products, ok, error },
        },
      } = await getProductList();

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
  }, [filterOptionStatus, filterOptionSkipQuantity, filterQuery]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리" />
        <FilterBar />
        <ProductManagerContainer>
          <ControllerContainer>
            <Select
              onChange={changeMultiSaleStatusHandler}
              onClick={handleSaleStatusClick}
              value={"DEFAULT"}
            >
              <Option value={"DEFAULT"} disabled hidden>
                판매상태 변경
              </Option>
              <Option value={"ON_SALE"}>판매중</Option>
              <Option value={"STOP_SALE"}>숨김</Option>
              <Option value={"SOLD_OUT"}>품절</Option>
            </Select>
            <Button
              size="small"
              backgroundColor="white"
              onClick={handleChangeCategoryModalButtonClick}
            >
              카테고리 변경
            </Button>
            <Button
              size="small"
              backgroundColor="white"
              onClick={handleChangeDiscountModalButtonClick}
            >
              할인율 변경
            </Button>
            <Button
              size="small"
              backgroundColor="white"
              onClick={handleDuplicateButtonClick}
            >
              복제
            </Button>
            <Button
              size="small"
              backgroundColor="white"
              onClick={handleDeleteButtonClick}
            >
              삭제
            </Button>
            <Input
              type="text"
              onChange={changeFilterQueryHandler}
              value={temporaryQuery}
            />

            <Select onChange={changeSkipQuantityHandler} defaultValue={20}>
              <Option value={20}>20개씩보기</Option>
              <Option value={50}>50개씩보기</Option>
              <Option value={100}>100개씩보기</Option>
            </Select>
          </ControllerContainer>

          <ProductListTable>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    onChange={changeAllCheckBoxHandler}
                    checked={checkAllBoxStatus}
                  />
                </th>
                <th>상품 번호</th>
                <th>상품명</th>
                <th>상품 가격</th>
                <th>할인율</th>
                <th>할인가</th>
                <th>재고</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {productList?.map(
                (
                  {
                    id,
                    name,
                    originalPrice,
                    discountMethod,
                    discountAmount,
                    discountAppliedPrice,
                    quantity,
                    status,
                    isChecked,
                  },
                  index
                ) => {
                  return (
                    <tr key={id}>
                      <td>
                        <Checkbox
                          onChange={changeSingleCheckBoxHandler(index)}
                          checked={isChecked}
                        />
                      </td>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{originalPrice}</td>
                      <td>
                        {discountMethod &&
                          discountAmount &&
                          `${discountAmount} ${discountMethod}`}
                      </td>
                      <td>
                        {getDiscountedPrice(
                          Number(originalPrice),
                          Number(discountAmount),
                          discountMethod
                        )}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        <Select
                          onChange={changeSingleSaleStatusHandler(id)}
                          value={status}
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
                        </Select>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </ProductListTable>
        </ProductManagerContainer>
      </ContentsContainer>
    </Layout>
  );
};

const ProductManagerContainer = styled.div`
  background-color: greenyellow;
`;

const ControllerContainer = styled.div`
  background-color: red;
  padding: 1em;

  display: flex;

  & > button {
    margin-right: 1em;
  }
`;

const ProductListTable = styled.table`
  background-color: skyblue;

  & td,
  th {
    padding: 1em;
  }
`;

const Input = styled.input`
  width: 100px;
  background-color: #fff;
`;

const Select = styled.select`
  background-color: skyblue;
`;
const Option = styled.option``;

export default Product;
