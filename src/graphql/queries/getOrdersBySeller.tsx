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
          bundleShipmentPrice
          bundleShipmentDistantPrice
          bundleShipmentType
          bundleOrderItemTotalPrice
          shipmentConditionalPrice
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
        merchantUid
        merchantItemUid
        isBundleShipment

        product {
          thumbnail
          name
        }

        user {
          name
          email
          phoneNumber
        }

        orderByShop {
          bundleShipmentPrice
          bundleShipmentDistantPrice
          bundleShipmentType
          bundleOrderItemTotalPrice
          shipmentConditionalPrice

          order {
            recipientName
            recipientPhoneNumber
            postCode
            paidAt
          }
        }
        statusReasons {
          id
          createdAt
          amount
          mainReason
          detailedReason
          status
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

export const GET_REFUND_ORDERS_BY_SELLER = gql`
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
          bundleShipmentPrice
          bundleShipmentDistantPrice
          bundleShipmentType
          bundleOrderItemTotalPrice
          shipmentConditionalPrice

          order {
            recipientName
            recipientPhoneNumber
            recipientAddress
            postCode
            paidAt
          }
        }

        statusReasons {
          id
          createdAt
          amount
          mainReason
          detailedReason
          cause
          status
          uploadedFileUrls {
            url
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

export const GET_EXCHANGE_ORDERS_BY_SELLER = gql`
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
          bundleShipmentPrice
          bundleShipmentDistantPrice
          bundleShipmentType
          bundleOrderItemTotalPrice
          shipmentConditionalPrice
          order {
            recipientName
            recipientPhoneNumber
            recipientAddress
            postCode
            paidAt
          }
        }

        statusReasons {
          id
          createdAt
          amount
          mainReason
          detailedReason
          cause
          status
          uploadedFileUrls {
            url
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
