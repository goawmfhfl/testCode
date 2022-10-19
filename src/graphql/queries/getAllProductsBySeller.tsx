import { gql } from "@apollo/client";

export interface GetAllProductsBySellerType {
  getAllProductsBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    products: Array<{
      id: number;
      name: string;
      category: {
        id: number;
        name: string;
        parent: { id: number; name: string } | null;
        children: { id: number; name: string } | null;
      };
      originalPrice: number;
      discountAmount: number | null;
      discountAppliedPrice: number | null;
      discountMethod: string | null;
      status: string;
      thumbnail: string;
      quantity: number;
    }>;
  };
}

export interface GetAllProductsBySellerInputType {
  input: {
    page?: number;
    skip?: number;
    status: string | null;
    query?: string;
  };
}

export const GET_ALL_PRODUCTS_BY_SELLER = gql`
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
        thumbnail
        status
      }
    }
  }
`;

export interface GetAllProductsStatusBySellerType {
  getAllProductsBySeller: {
    ok: boolean;
    error: string;
    totalResults: number;
  };
}

export interface GetAllProductsStatusBySellerInPutType {
  input: {
    status: string | null;
  };
}

export const GET_ALL_PRODCUCTS_STATUS_BY_SELLER = gql`
  query GetAllProductsBySeller($input: GetAllProductsBySellerInput!) {
    getAllProductsBySeller(input: $input) {
      ok
      error
      totalResults
    }
  }
`;
