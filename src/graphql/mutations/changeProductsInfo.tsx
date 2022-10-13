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
    discountAmount?: number;
    discountMethod?: string;
    startDiscountDate?: string | null;
    endDiscountDate?: string | null;
    isBmarket?: boolean;
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
