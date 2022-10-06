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
    categoryName: string;
  };
}

export const CHANGE_PRODUCTS_INFO = gql`
  mutation changeProductsInfo($input: ChangeProductInfoInput!) {
    changeProductsInfo(input: $input) {
      ok
      error
    }
  }
`;
