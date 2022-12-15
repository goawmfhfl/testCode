import { gql } from "@apollo/client";

export const SEND_ORDERITEMS = gql`
  mutation SendOrderItems($input: SendOrderItemsinput!) {
    sendOrderItems(input: $input) {
      ok
      error
    }
  }
`;
