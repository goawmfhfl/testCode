import { gql } from "@apollo/client";

export const EDIT_PRODUCT = gql`
  mutation EditProduct($input: EditProductInput!) {
    editProduct(input: $input) {
      ok
      error
    }
  }
`;
