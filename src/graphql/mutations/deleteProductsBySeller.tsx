import { gql } from "@apollo/client";

export interface DeleteProductsBySeller {
  deleteProductsBySeller: {
    ok: boolean;
    error: string | null;
  };
}

export interface DeleteProductsBySellerInputType {
  input: {
    productsIds: number[];
  };
}

export const DELETE_PRODUCTS_BY_SELLER = gql`
  mutation DeleteProdcutsBySeller($input: DeleteProductsBySellerInput!) {
    deleteProductsBySeller(input: $input) {
      ok
      error
    }
  }
`;
