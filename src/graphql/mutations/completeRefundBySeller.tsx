import { gql } from "@apollo/client";

export const COMPLETE_REFUND_BY_SELLER = gql`
  mutation CompleteRefundBySeller($input: CompleteRefundBySellerInput!) {
    completeRefundBySeller(input: $input) {
      ok
      error
    }
  }
`;
