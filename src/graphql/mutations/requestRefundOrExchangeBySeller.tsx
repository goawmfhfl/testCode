import { gql } from "@apollo/client";

export const REQEUST_REFUND_OR_EXCHANGE_BY_SELLER = gql`
  mutation RequestRefundOrExchangeBySeller(
    $input: RequestRefundOrExchangeBySellerInput!
  ) {
    requestRefundOrExchangeBySeller(input: $input) {
      ok
      error
    }
  }
`;
