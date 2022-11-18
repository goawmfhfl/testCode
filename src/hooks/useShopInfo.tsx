import { useQuery, QueryResult, OperationVariables } from "@apollo/client";

import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";

export type ShopInfoResult = QueryResult<
  {
    getShopInfo: ShopInfo;
  },
  OperationVariables
>;

export default function useShopInfo(): ShopInfoResult {
  const result =
    useQuery<{
      getShopInfo: ShopInfo;
    }>(GET_SHOP_INFO);

  return result;
}
