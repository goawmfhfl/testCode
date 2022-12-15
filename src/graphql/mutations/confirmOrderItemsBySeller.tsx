import { gql } from "@apollo/client";

export const CONFIRM_ORDERITMES_BY_SELLER = gql`
  mutation ConfirmOrderItemsBySeller($input: ConfirmOrderItemsBySellerInput!) {
    confirmOrderItemsBySeller(input: $input) {
      ok
      error
    }
  }
`;
