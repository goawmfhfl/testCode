import { gql } from "@apollo/client";

export const SEND_ORDERITEMS = gql`
  mutation SendOrderItems($input: SendOrderItemsInput!) {
    sendOrderItems(input: $input) {
      ok
      error
    }
  }
`;
