import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  checkedProductsListVar,
  filterOptionStatusVar,
} from "@cache/ProductManagement";
import { modalVar, systemModalVar } from "@cache/index";
import {
  ProductsListVarType,
  getProductBySellerVar,
  SaleStatusType,
  SaleStatusName,
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

const Product = () => {
  const filterOptionStatus: string | null = useReactiveVar(
    filterOptionStatusVar
  );

  const [filterOptionSkipQuantity, setFilterOptionSkipQuantity] =
    useState<number>(20);

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

  const [updateCategory] =
    useMutation<ChangeProductsInfoType, ChangeProductsInfoInputType>(
      CHANGE_PRODUCTS_INFO
    );

  const productsList: Array<ProductsListVarType> = useReactiveVar(
    getProductBySellerVar
  );

  const selectedProductList: Array<ProductsListVarType> = useReactiveVar(
    checkedProductsListVar
  );

  const [selectedProductListIds, setSelectedProductListIds] = useState<
    Array<number>
  >([]);

  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

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

  const handleSaleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          {saleStatus[value]}(으)로 변경하시겠습니까?
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
            } = await updateCategory({
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
                  setIsAllChecked(false);
                  checkedProductsListVar([]);

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
  };

  const handleAllCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAllChecked(e.target.checked);
    if (e.target.checked) {
      const checkAllProductList = productsList.map((product) => ({
        ...product,
        isChecked: true,
      }));

      getProductBySellerVar(checkAllProductList);
      checkedProductsListVar(checkAllProductList);
    }

    if (!e.target.checked) {
      const checkAllProductList = productsList.map((product) => ({
        ...product,
        isChecked: false,
      }));

      getProductBySellerVar(checkAllProductList);
      checkedProductsListVar([]);
    }
  };

  const handleCheckBoxChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const checkedProductList = { ...productsList[index], isChecked: true };
        checkedProductsListVar([...selectedProductList, checkedProductList]);

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

          checkedProductsListVar([
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

          checkedProductsListVar([...selectedProductList, checkedProductList]);

          newProductList[index].isChecked = false;
          getProductBySellerVar(productsList);
        }
      }
    };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    setFilterOptionSkipQuantity(Number(value));
  };

  useEffect(() => {
    setSelectedProductListIds(selectedProductList?.map((list) => list.id));
  }, [selectedProductList]);

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
              onChange={handleSaleStatusChange}
              onClick={handleSaleStatusClick}
            >
              <Option defaultChecked>판매상태 변경</Option>
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
                    checked={isAllChecked}
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
                      <td>{status}</td>
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
