import styled from "styled-components";
import { useQuery, gql } from "@apollo/client";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Button from "@components/common/Button";

const GET_ALL_PRODUCTS_BY_SELLER = gql`
  query GetAllProductsBySeller($input: GetAllProductsBySellerInput!) {
    getAllproductsBySeller(input: $input) {
      ok
      error
      totalPages
      totalResults
      products {
        id
        name
        originalPrice
        quantity
        status
      }
    }
  }
`;

const Product = () => {
  const result = useQuery<
    {
      getAllproductsBySeller: {
        ok: boolean;
        error: string;
        totalPages: number;
        totalResults: number;
        products: Array<{
          id: number;
          name: string;
          originalPrice: number;
          quantity: number;
          status: string;
        }>;
      };
    },
    { input: { page: number } }
  >(GET_ALL_PRODUCTS_BY_SELLER, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  console.log(result);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리"></ContentsHeader>
        <FilterBar>
          <FilterItem>전체</FilterItem>
          <FilterItem>판매중</FilterItem>
          <FilterItem>숨김</FilterItem>
          <FilterItem>품절</FilterItem>
        </FilterBar>

        <ProductManagerContainer>
          <ControllerContainer>
            <Button size="small" backgroundColor="white">
              판매상태 변경
            </Button>
            <Button size="small" backgroundColor="white">
              카테고리 변경
            </Button>
            <Button size="small" backgroundColor="white">
              할인율 변경
            </Button>
            <Button size="small" backgroundColor="white">
              복제
            </Button>
            <Button size="small" backgroundColor="white">
              삭제
            </Button>
          </ControllerContainer>

          <ProductListTable>
            <thead>
              <tr>
                <th>상품 번호</th>
                <th>상품명</th>
                <th>상품 가격</th>
                <th>재고</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {result.data?.getAllproductsBySeller.products.map(
                ({ id, name, originalPrice, quantity, status }) => {
                  return (
                    <tr>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{originalPrice}</td>
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

const FilterBar = styled.ul`
  background-color: pink;
  padding: 1em;

  display: flex;
`;

const FilterItem = styled.li`
  background-color: yellow;
  padding: 1em;
  margin-right: 1em;
`;

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

export default Product;
