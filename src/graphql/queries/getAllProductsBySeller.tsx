import { gql } from "@apollo/client";

export interface ProductsType {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    parent: { id: number; name: string } | null;
    children: { id: number; name: string } | null;
  };
  originalPrice: number;
  discountAmount?: number;
  discountMethod?: string;
  status: string;
  thumbnail: string;
  quantity: number;
  isChecked?: boolean;
}

export interface GetAllProductsBySellerType {
  getAllProductsBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    products: Array<ProductsType>;
  };
}

export interface GetAllProductsBySellerInputType {
  input: {
    page?: number;
    skip?: number;
    status?: string;
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
        discountAmount
        discountMethod
        discountAmount
        originalPrice
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
