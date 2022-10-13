import React, { useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  selectedProductListVar,
  filterOptionStatusVar,
  selectedProductListIdsVar,
  checkAllBoxStatusVar,
  filterOptionSkipQuantityVar,
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

const saleStatusList = [
  { id: 0, label: "ON_SALE", name: "판매중" },
  { id: 1, label: "STOP_SALE", name: "숨김" },
  { id: 2, label: "SOLD_OUT", name: "품절" },
];

const Product = () => {
  const productsList: Array<ProductsListVarType> = useReactiveVar(
    getProductBySellerVar
  );

  const selectedProductList: Array<ProductsListVarType> = useReactiveVar(
    selectedProductListVar
  );

  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );

  const filterOptionSkipQuantity: number = useReactiveVar(
    filterOptionSkipQuantityVar
  );

  const selectedProductListIds: Array<number> = selectedProductListIdsVar(
    selectedProductList.map((list) => list.id)
  );

  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

  const [getProductListBySeller, { refetch }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: filterOptionSkipQuantity,
        status: filterOptionStatus,
      },
    },
    fetchPolicy: "no-cache",
  });

  const [updateProductsStatus] =
    useMutation<ChangeProductsInfoType, ChangeProductsInfoInputType>(
      CHANGE_PRODUCTS_INFO
    );

  const [deleteProducts] = useMutation<
    DeleteProductsBySeller,
    DeleteProductsBySellerInputType
  >(DELETE_PRODUCTS_BY_SELLER);

  const showHasCheckedAnyProductModal = () => {
    return systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요.
        </>
      ),
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
    });
  };

  const handleMultiSaleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    if (value === "판매상태 변경") return;

    const saleStatus = {
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
      confirmButtonClickHandler: () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            const {
              data: {
                changeProductsInfo: { error, ok },
              },
            } = await updateProductsStatus({
              variables: {
                input: {
                  productIds: selectedProductListIds,
                  productStatus: value,
                },
              },
            });

            if (error) {
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: (
                  <>
                    에러메세지
                    <br />
                    {error}
                  </>
                ),
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }

            if (ok) {
              const {
                data: {
                  getAllProductsBySeller: { products },
                },
              } = await refetch();

              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>{saleStatus[value]}(으)로 변경되었습니다</>,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  getProductBySellerVar(
                    products.map((list) => ({ ...list, isChecked: false }))
                  );

                  e.target.selectedIndex = 0;
                  checkAllBoxStatusVar(false);
                  selectedProductListVar([]);

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }
          })();
        } catch (error) {
          console.log(error);
        }
      },
      cancelButtonVisibility: true,
    });
  };

  const handleSingleSaleStatusChange =
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
          try {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (async () => {
              const {
                data: {
                  changeProductsInfo: { error, ok },
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
                    getAllProductsBySeller: { products },
                  },
                } = await refetch();

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

              if (error) {
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,
                  description: (
                    <>
                      에러메세지
                      <br />
                      {error}
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
            })();
          } catch (error) {
            console.log(error);
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

  const handleSaleStatusClick = () => {
    if (!selectedProductList.length) {
      return showHasCheckedAnyProductModal();
    }
  };

  const handleChangeCategoryModalButtonClick = () => {
    if (!selectedProductList.length) {
      return showHasCheckedAnyProductModal();
    }

    modalVar({
      isVisible: true,
      component: <ChangeCategoryModal />,
    });
  };

  const handleChangeDiscountModalButtonClick = () => {
    if (!selectedProductList.length) {
      return showHasCheckedAnyProductModal();
    }

    modalVar({
      isVisible: true,
      component: <ChangeDiscountModal />,
    });
  };

  const handleDuplicateButtonClick = () => {
    if (!selectedProductList.length) {
      return showHasCheckedAnyProductModal();
    }
  };

  const handleDeleteButtonClick = () => {
    if (!selectedProductList.length) {
      return showHasCheckedAnyProductModal();
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
            const {
              data: {
                deleteProductsBySeller: { ok, error },
              },
            } = await deleteProducts({
              variables: {
                input: {
                  productsIds: selectedProductListIds,
                },
              },
            });

            if (ok) {
              const {
                data: {
                  getAllProductsBySeller: { products },
                },
              } = await refetch();

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

            if (error) {
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: (
                  <>
                    에러메시지
                    <br />
                    {error}
                  </>
                ),
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,

                confirmButtonClickHandler: () => {
                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }
          })();
        } catch (error) {
          // TODO: 요청 조차 못한 상태 처리하기
          console.log("error", error);

          if (error) {
            return systemModalVar({
              ...systemModalVar(),
              isVisible: true,
              description: (
                <>
                  인터넷 서버 장애로 인해
                  <br />
                  할인율 변경을 완료하지 못했습니다.
                  <br />
                  다시 시도해 주시길 바랍니다.
                </>
              ),
              confirmButtonVisibility: true,
              cancelButtonVisibility: false,
            });
          }
        }
      },
    });
  };

  const handleAllCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkAllBoxStatusVar(e.target.checked);
    if (e.target.checked) {
      const checkAllProductList = productsList.map((product) => ({
        ...product,
        isChecked: true,
      }));

      getProductBySellerVar(checkAllProductList);
      selectedProductListVar(checkAllProductList);
    }

    if (!e.target.checked) {
      const checkAllProductList = productsList.map((product) => ({
        ...product,
        isChecked: false,
      }));

      getProductBySellerVar(checkAllProductList);
      selectedProductListVar([]);
    }
  };

  const handleCheckBoxChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const checkedProductList = { ...productsList[index], isChecked: true };
        selectedProductListVar([...selectedProductList, checkedProductList]);

        productsList[index].isChecked = true;
        getProductBySellerVar(productsList);
      }

      if (!e.target.checked) {
        const newProductList = [...productsList];
        const isCheckedList = selectedProductList.filter(
          (product) => product.id === productsList[index].id
        );

        if (isCheckedList) {
          const checkedListIndex = selectedProductList.findIndex(
            (product) => product.id === productsList[index].id
          );

          selectedProductListVar([
            ...selectedProductList.slice(0, checkedListIndex),
            ...selectedProductList.slice(checkedListIndex + 1),
          ]);

          newProductList[index].isChecked = false;
          getProductBySellerVar(productsList);
        }

        if (!isCheckedList) {
          const checkedProductList = {
            ...productsList[index],
            isChecked: false,
          };

          selectedProductListVar([...selectedProductList, checkedProductList]);

          newProductList[index].isChecked = false;
          getProductBySellerVar(productsList);
        }
      }
    };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    filterOptionSkipQuantityVar(Number(value));
  };

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const {
          data: {
            getAllProductsBySeller: { ok, error, products },
          },
        } = await getProductListBySeller({
          variables: {
            input: {
              page: 1,
              skip: filterOptionSkipQuantity,
              status: filterOptionStatus,
            },
          },
        });

        if (error) {
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: (
              <>
                에러메세지
                <br />
                {error}
              </>
            ),
            cancelButtonVisibility: false,

            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });
        }

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
      })();
    } catch (error) {
      console.log(error);
    }
  }, [filterOptionStatus, filterOptionSkipQuantity]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리" />
        <FilterBar />
        <ProductManagerContainer>
          <ControllerContainer>
            <Select
              onChange={handleMultiSaleStatusChange}
              onClick={handleSaleStatusClick}
            >
              <Option selected disabled hidden>
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

            <Select onChange={changeSkipQuantityHandler}>
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
                    onChange={handleAllCheckBoxChange}
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
              {productsList?.map(
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
                          onChange={handleCheckBoxChange(index)}
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
                          onChange={handleSingleSaleStatusChange(id)}
                          value={status}
                        >
                          {saleStatusList.map(({ id, label, name }) => (
                            <Option
                              key={id}
                              selected={status === label}
                              value={label}
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

const Select = styled.select`
  background-color: skyblue;
`;
const Option = styled.option``;

export default Product;
