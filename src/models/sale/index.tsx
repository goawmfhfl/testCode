import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";

export interface SkipQuantityType {
  id: number;
  label: string;
  value: number;
}

export interface FilterOptionVarType {
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup: OrderStatusGroup;
}

export interface SearchQueryType {
  id: number;
  label: string;
  value: string;
}
