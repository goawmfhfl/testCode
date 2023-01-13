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
  thumbnail: string;
  quantity: number;
  status: ProductStatus;
  options: Array<{
    quantity: number;
    isRequired: boolean;
  }>;
}

export interface GetProductsBySellerType {
  getProductsBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    products: Array<ProductsType>;
  };
}

export interface GetProductsBySellerInputType {
  input: {
    page: number;
    skip?: number;
    status?: ProductStatus;
    query?: string;
  };
}

export const GET_PRODUCTS_BY_SELLER = gql`
  query GetProductsBySeller($input: GetAllProductsBySellerInput!) {
    getProductsBySeller(input: $input) {
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
        options {
          quantity
          isRequired
        }
      }
    }
  }
`;

export interface GetProductStatusBySellerType {
  getProductsBySeller: {
    ok: boolean;
    error: string;
    totalResults: number;
    products: Array<{
      id: number;
      status: ProductStatus;
    }>;
  };
}

export interface GetProductStatusBySellerInPutType {
  input: {
    page: number;
    skip?: number;
    status?: ProductStatus;
    query?: string;
  };
}

export const GET_PRODCUCTS_STATUS_BY_SELLER = gql`
  query GetProductsBySeller($input: GetAllProductsBySellerInput!) {
    getProductsBySeller(input: $input) {
      ok
      error
      products {
        status
      }
    }
  }
`;
