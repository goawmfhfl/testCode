import { gql } from "@apollo/client";

import { ProductType } from "@models/product/index";

export interface GetProductsByIdType {
  getProductById: {
    ok: boolean;
    error: string;
    product: ProductType;
  };
}

export interface GetProductsByIdInputType {
  input: {
    productId: number;
    limit?: number;
  };
}

export const GET_PRODUCTS_BY_ID = gql`
  query GetProductById($input: ProductInput!) {
    getProductById(input: $input) {
      ok
      error
      product {
        name
        isBmarket
        description
        colors {
          name
        }
        createdAt
        updatedAt

        originalPrice
        discountAmount
        discountMethod
        startDiscountDate
        endDiscountDate
        quantity

        isSelectiveOptionInUse
        options {
          id
          index
          isRequired
          components {
            name
            value
          }
          price
          quantity
        }

        manufacturingLeadTime {
          min
          max
        }
        specName
        material
        weight
        size
        manufacturer
        precaution
        authorization
        personInCharge
        thumbnail
        isExclusive
        isBmarket
        isMdPick
        shipment {
          id
        }
        shipmentPrice
        shipmentDistantPrice
        shipmentReturnPrice
        shipmentExchangePrice
        shipmentType
        isBundleShipment
        status
        category {
          name
          parent {
            name
          }
          children {
            name
          }
        }
        productToTags {
          id
          index
          isExposed
          tag {
            id
            name
          }
        }
        uploadedFileUrls {
          id
          url
          type
        }
      }
    }
  }
`;
