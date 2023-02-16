import { gql } from "@apollo/client";

export const DENY_REFUND_OR_EXCHANGE_REQUEST_BY_SELLER = gql`
  mutation DenyRefundOrExchangeRequestBySeller(
    $input: DenyRefundOrExchangeRequestBySellerInput!
  ) {
    denyRefundOrExchangeRequestBySeller(input: $input) {
      ok
      error
    }
  }
`;
