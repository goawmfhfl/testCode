import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";

export interface SearchQueryCacheType {
  id: number;
  label: string;
  value: string;
}

export interface NormalizedListType {
  orders: {
    allIds: Array<number>;
    byId: { [key: number]: OrderItemsType };
  };
}
