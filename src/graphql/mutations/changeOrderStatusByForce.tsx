import { gql } from "@apollo/client";

export const CHANGE_ORDER_STATUS_BY_FORCE = gql`
  mutation ChangeOrderStatusByForce($input: ChangeOrderStatusByForceInput!) {
    changeOrderStatusByForce(input: $input) {
      ok
      error
    }
  }
`;
