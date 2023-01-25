import { gql } from "@apollo/client";

export const GET_ORDERS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalPages
      totalResults
      totalOrderItems {
        id
        merchantUid
        merchantItemUid
        isBundleShipment
        product {
          code
          thumbnail
          name
        }
        user {
          name
          email
          phoneNumber
        }
        orderByShop {
          order {
            recipientName
            recipientPhoneNumber
            recipientAddress
            postCode
            shipmentMemo
            paidAt
          }
        }
        options {
          id
          components {
            name
            value
          }
          price
          quantity
          isRequired
        }
        quantity
        discountAppliedPrice
        originalPrice
        shipmentPrice
        shipmentDistantPrice
        shipmentType
        orderShipmentInfos {
          id
          shipmentNumber
          shipmentCompany
          status
        }
        orderStatus {
          name
        }
        claimStatus {
          name
        }
      }
    }
  }
`;

export const GET_CANCEL_ORDERS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalPages
      totalResults
      totalOrderItems {
        id
        merchantItemUid

        product {
          code
          thumbnail
          name
        }

        user {
          name
          email
          phoneNumber
          payments {
            createdAt
          }
        }

        orderByShop {
          order {
            recipientName
            recipientPhoneNumber
          }
        }

        options {
          components {
            name
            value
          }
          price
        }
        quantity
        discountAppliedPrice
        originalPrice
        shipmentPrice
        shipmentDistantPrice

        statusReasons {
          id
          createdAt
          amount
          mainReason
          detailedReason
          status
        }
        orderStatus {
          name
        }
        claimStatus {
          name
        }
      }
    }
  }
`;

export const GET_ORDER_STATUS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalOrderItems {
        orderStatus {
          name
        }
      }
    }
  }
`;
