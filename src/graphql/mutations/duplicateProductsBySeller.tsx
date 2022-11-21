import { gql } from "@apollo/client";

export interface DuplicateProductsBySellerType {
  duplicateProductsBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface DuplicateProductsBySellerInputType {
  input: {
    productIds: Array<number>;
  };
}

export const DUPLICATE_PRODUCTS_BY_SELLER = gql`
  mutation DuplicateProdcutsBySeller($input: DuplicateProductsBySellerInput!) {
    duplicateProductsBySeller(input: $input) {
      ok
      error
    }
  }
`;
