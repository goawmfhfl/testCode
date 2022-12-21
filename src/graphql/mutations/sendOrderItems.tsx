import { gql } from "@apollo/client";

export const SEND_ORDER_ITEMS = gql`
  mutation SendOrderItems($input: SendOrderItemsInput!) {
    sendOrderItems(input: $input) {
      ok
      error
    }
  }
`;
