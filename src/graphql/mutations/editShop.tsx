import { gql } from "@apollo/client";

export const EDIT_SHOP = gql`
  mutation EditShop($input: EditShopInput!) {
    editShop(input: $input) {
      ok
      error
    }
  }
`;
