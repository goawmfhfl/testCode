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
        description
        colors {
          name
        }
        originalPrice
        discountAmount
        discountMethod
        startDiscountDate
        endDiscountDate
        quantity

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
          createdAt
          updatedAt
          deletedAt
          isExposed
          tag {
            id
            name
          }
        }
      }
    }
  }
`;
