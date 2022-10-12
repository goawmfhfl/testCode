import { gql } from "@apollo/client";

export interface ChangeProductsInfoType {
  changeProductsInfo: {
    ok: boolean;
    error: string | null;
  };
}

export interface ChangeProductsInfoInputType {
  input: {
    productIds: number[];
    categoryName?: string;
    productStatus?: string;
    discountAmount?: string;
    discountMethod?: string;
    startDiscountDate?: string;
    endDiscountDate?: string;
  };
}

export const CHANGE_PRODUCTS_INFO = gql`
  mutation ChangeProductsInfo($input: ChangeProductInfoInput!) {
    changeProductsInfo(input: $input) {
      ok
      error
    }
  }
`;
