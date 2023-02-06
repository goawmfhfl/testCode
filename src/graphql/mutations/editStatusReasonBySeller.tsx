import { gql } from "@apollo/client";

export const EDIT_STATUS_REASON_BY_SELLER = gql`
  mutation EditStatusReasonBySeller($input: EditStatusReasonBySellerInput!) {
    editStatusReasonBySeller(input: $input) {
      ok
      error
    }
  }
`;
