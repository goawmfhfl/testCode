import { gql } from "@apollo/client";
import { ProductStatus } from "@constants/product";

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
  status: ProductStatus;
  thumbnail: string;
  quantity: number;
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
    status?: ProductStatus;
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

export interface GetAllProductStatusBySellerType {
  getAllProductsBySeller: {
    ok: boolean;
    error: string;
    totalResults: number;
    products: Array<{
      id: number;
      status: ProductStatus;
    }>;
  };
}

export interface GetAllProductStatusBySellerInPutType {
  input: {
    page?: number;
    skip?: number;
    status?: ProductStatus;
    query?: string;
  };
}

export const GET_ALL_PRODCUCTS_STATUS_BY_SELLER = gql`
  query GetAllProductsBySeller($input: GetAllProductsBySellerInput!) {
    getAllProductsBySeller(input: $input) {
      ok
      error
      products {
        status
      }
    }
  }
`;
