import { useQuery, QueryResult, OperationVariables } from "@apollo/client";

import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";
import { QueryResponse } from "@models/index";

export type ShopInfoResult = QueryResult<
  {
    getShopInfo: QueryResponse<{
      shop: ShopInfo;
    }>;
  },
  OperationVariables
>;

export default function useShopInfo(): ShopInfoResult {
  return useQuery<{
    getShopInfo: QueryResponse<{
      shop: ShopInfo;
    }>;
  }>(GET_SHOP_INFO, {
    fetchPolicy: "no-cache",
  });
}
