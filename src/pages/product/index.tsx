import { useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import GET_ALL_PRODUCTS_BY_SELLER, {
  GetAllProductsBySellerType,
  GetAllProductsBySellerInputType,
} from "@graphql/queries/getAllProductsBySeller";
import { filterOptionNameVar } from "@cache/productRegistration/productManagement";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Button from "@components/common/Button";
import { getDiscountedPrice } from "@utils/productRegistration";

const GET_ALL_PRODUCTS_BY_SELLER = gql`
  query GetAllProductsBySeller($input: GetAllProductsBySellerInput!) {
    getAllProductsBySeller(input: $input) {
      ok
      error
      totalPages
      totalResults
      products {
        id
        name
        category {
          id
          name
        }
        originalPrice
        discountAmount
        discountMethod
        quantity
        status
      }
    }
  }
`;

const Product = () => {
  const result = useQuery<
    {
      getAllProductsBySeller: {
        ok: boolean;
        error: string;
        totalPages: number;
        totalResults: number;
        products: Array<{
          id: number;
          name: string;
          originalPrice: number;
          discountMethod: string;
          discountAmount: number;
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
        skip: 20,
        status: null,
      },
    },
  });

  useEffect(() => {
    // eslint-disable-next-line
    getProductBySeller({
      variables: {
        input: {
          page: 1,
          skip: 20,
          status: filterOptionName,
        },
      },
    });
  }, [filterOptionName]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리"></ContentsHeader>
        <FilterBar />
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
                <th>할인율</th>
                <th>할인가</th>
                <th>재고</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {data?.getAllProductsBySeller.products.map(
                ({
                  id,
                  name,
                  originalPrice,
                  discountMethod,
                  discountAmount,
                  quantity,
                  status,
                }) => {
                  return (
                    <tr key={id}>
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

export default Product;
