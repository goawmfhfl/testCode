import { gql } from "@apollo/client";

export const CANCEL_ORDERITEMS_BY_SELLER = gql`
  mutation CancelOrderItemsBySeller($input: CancelOrderItemsBySellerInput!) {
    cancelOrderItemsBySeller(input: $input) {
      ok
      error
    }
  }
`;
