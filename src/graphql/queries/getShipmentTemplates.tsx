import { gql } from "@apollo/client";

export const GET_SHIPMENT_TEMPLATES = gql`
  query GetAllShipmentTemplates {
    getUserShipmentTemplates {
      ok
      error
      shipmentTemplates {
        id
        name
        createdAt
        updatedAt
        type
        price
        distantPrice
        returnPrice
        exchangePrice
        isBundleShipment
      }
    }
  }
`;
