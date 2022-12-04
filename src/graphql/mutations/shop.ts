import { gql } from "@apollo/client";

export const TEMPORARY_SAVE_SHOP_SETTINGS = gql`
  mutation TemporarySaveShop($input: TemporarySaveShopInput!) {
    temporarySaveShop(input: $input) {
      ok
      error
      __typename
    }
  }
`;

export const SAVE_SHOP_SETTINGS = gql`
  mutation SubmitShop($input: RegisterShopInput!) {
    registerShop(input: $input) {
      ok
      error
    }
  }
`;

export const TEMPORARY_SAVE_PRODUCT = gql`
  mutation TemporarySaveProduct($input: TemporarySaveProductInput!) {
    temporarySaveProduct(input: $input) {
      ok
      error
      productId
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ok
      error
    }
  }
`;
