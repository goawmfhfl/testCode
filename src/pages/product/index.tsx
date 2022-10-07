import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  checkedProductsListVar,
  filterOptionStatusVar,
} from "@cache/ProductManagement";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Button from "@components/common/Button";
import Checkbox from "@components/common/input/Checkbox";
import FilterBar from "@components/ProductRegistration/ProductManagement/FilterBar";
import ChangeCategoryModal from "@components/ProductRegistration/ProductManagement/ChangeCategoryModal";
import ChangeDiscountModal from "@components/ProductRegistration/ProductManagement/ChangeDiscountModal";

import { modalVar } from "@cache/index";
import { CheckedProductsListVarType } from "@cache/ProductManagement";

const Product = () => {
  const [getProductBySeller, { data }] = useLazyQuery<
    GetAllProductsBySellerType,
    GetAllProductsBySellerInputType
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
        skip: 20,
        status: null,
      },
    },
  });
  const selectedProductList: Array<CheckedProductsListVarType> = useReactiveVar(
    checkedProductsListVar
  );
  const filterOptionStatus = useReactiveVar(filterOptionStatusVar);
  const [filterOptionSkipQuantity, setFilterOptionSkipQuantity] =
    useState<number>(20);

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    setFilterOptionSkipQuantity(Number(value));
  };

  const handleTableRowClick =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!data) return;
      console.log(e.target.checked);

      if (e.target.checked) {
        console.log("체크 할 경우");
        checkedProductsListVar([
          ...selectedProductList,
          data.getAllProductsBySeller.products[index],
        ]);
      }
      if (!e.target.checked) {
        console.log("체크를 해제 할 경우");
      }
    };

  const handleChangeCategoryModalButtonClick = () => {
    modalVar({
      isVisible: true,
      component: <ChangeCategoryModal />,
    });
  };

  const handleChangeDiscountModalButtonClick = () => {
    modalVar({
      isVisible: true,
      component: <ChangeDiscountModal />,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line
    getProductBySeller({
      variables: {
        input: {
          page: 1,
          skip: filterOptionSkipQuantity,
          status: filterOptionStatus,
        },
      },
    });
  }, [filterOptionStatus, filterOptionSkipQuantity]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리" />
        <FilterBar />
        <ProductManagerContainer>
          <ControllerContainer>
            <Button size="small" backgroundColor="white">
              판매상태 변경
            </Button>
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
            <Button size="small" backgroundColor="white">
              복제
            </Button>
            <Button size="small" backgroundColor="white">
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
                  <Checkbox />
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
              {data?.getAllProductsBySeller.products.map(
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
                  },
                  index
                ) => {
                  return (
                    <tr key={id}>
                      <td>
                        <Checkbox onChange={handleTableRowClick(index)} />
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
