import { gql } from "@apollo/client";

export interface GetAllProductsBySellerType {
  getAllProductsBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    products: Array<{
      // need reconfigure category Type
      category: string;
      id: number;
      name: string;
      originalPrice: number;
      discountAmount: number | null;
      discountAppliedPrice: number | null;
      discountMethod: string | null;
      status: string;
      quantity: number;
    }>;
  };
}

export interface GetAllProductsBySellerInputType {
  input: {
    page: number;
    skip: number;
    status: string | null;
    query?: string;
  };
}

const GET_ALL_PRODUCTS_BY_SELLER = gql`
  query getAllProductsBySeller($input: GetAllProductsBySellerInput!) {
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
          parent {
            id
            name
          }
          children {
            id
            name
          }
        }
        originalPrice
        discountAppliedPrice
        discountAmount
        discountMethod
        quantity
        status
      }
    }
  }
`;

export default GET_ALL_PRODUCTS_BY_SELLER;
