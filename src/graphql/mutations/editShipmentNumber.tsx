import { gql } from "@apollo/client";

export const EDIT_SHIPMENT_NUMBER = gql`
  mutation EditShipmentNumber($input: EditShipmentNumberInput!) {
    editShipmentNumber(input: $input) {
      ok
      error
    }
  }
`;
