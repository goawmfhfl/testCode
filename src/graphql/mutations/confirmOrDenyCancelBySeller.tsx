import { gql } from "@apollo/client";

export const CONFIRM_OR_DENY_CANCEL_BY_SELLER = gql`
  mutation ConfirmOrDenyCancelBySeller(
    $input: ConfirmOrDenyCancelBySellerInput!
  ) {
    confirmOrDenyCancelBySeller(input: $input) {
      ok
      error
    }
  }
`;
