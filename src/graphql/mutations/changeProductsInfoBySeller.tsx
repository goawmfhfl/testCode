import { gql } from "@apollo/client";

export interface ChangeProductsInfoBySellerType {
  changeProductsInfoBySeller: {
    ok: boolean;
    error: string | null;
  };
}

export interface ChangeProductsInfoBySellerInputType {
  input: {
    productIds: number[];
    categoryName?: string;
    productStatus?: string;
    discountAmount?: number;
    discountMethod?: string;
    startDiscountDate?: string | null;
    endDiscountDate?: string | null;
    isBmarket?: boolean;
  };
}

export const CHANGE_PRODUCTS_INFO_BY_SELLER = gql`
  mutation ChangeProductsInfoBySeller(
    $input: ChangeProductsInfoBySellerInput!
  ) {
    changeProductsInfoBySeller(input: $input) {
      ok
      error
    }
  }
`;
