import {
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentType,
} from "@constants/sale";

import { OrderItems } from "@models/sale/index";

export interface FilterOptionVarType {
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup: OrderStatusGroup;
}

export interface EditStatusReasonBySellerType {
  editStatusReasonBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface EditStatusReasonBySellerInputType {
  orderItemId: number;
  mainReason: MainReason;
  detailedReason: string;
  orderStatusName: OrderStatusName;
}

export interface GetCancelOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    totalOrderItems: Array<OrderItems>;
  };
}

export interface GetCancelOrdersBySellerInputType {
  page?: number;
  skip?: number;
  query?: string;
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup: OrderStatusGroup;
}

export interface NormalizedType {
  orders: {
    allIds: Array<string>;
    byId: { [key: string]: OrderItems };
  };
}
