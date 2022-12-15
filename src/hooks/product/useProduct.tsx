import { OperationVariables, QueryResult, useQuery } from "@apollo/client";

import { GET_PRODUCTS_BY_ID } from "@graphql/queries/getProductsById";
import { QueryResponse } from "@models/index";
import { ProductType } from "@models/product";

type ProductResult = QueryResult<
  {
    getProductById: QueryResponse<{
      product: ProductType;
    }>;
  },
  OperationVariables
>;

const useProduct = (productId: string): ProductResult => {
  return useQuery(GET_PRODUCTS_BY_ID, {
    variables: {
      input: {
        productId: Number(productId),
      },
    },
    skip: !productId,
    onError(error) {
      console.log("Error occurred on fetching product", error);
    },
  });
};

export default useProduct;
