import { makeVar } from "@apollo/client";
import { SearchQueryCacheType } from "@models/order/orderManagement";

export const searchQueryCache: Array<SearchQueryCacheType> = [
  { id: 0, label: "구매자명", value: "BUYER_NAME" },
  { id: 1, label: "구매자 전화번호", value: "BUYER_PHONE_NUMBER" },
  { id: 2, label: "주문번호", value: "ORDER_NUMBER" },
];

export const searchQueryCacheVar =
  makeVar<Array<SearchQueryCacheType>>(searchQueryCache);
