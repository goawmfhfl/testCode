import {
  Cause,
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";
import { DenyRefundOrExchangeRequestType } from "@constants/sale";
import { OrderItems } from "@models/sale/index";

export interface GetRefundOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    totalOrderItems: Array<OrderItems>;
  };
}

export interface GetRefundOrdersBySellerInputType {
  page?: number;
  skip?: number;
  query?: string;
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup: OrderStatusGroup;
}

export interface DenyRefundOrExchangeRequestBySellerType {
  denyRefundOrExchangeRequestBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface DenyRefundOrExchangeRequestBySellerInputType {
  components: Array<{
    orderItemId: number;
    mainReason: MainReason;
    detailedReason: string;
  }>;
  type: DenyRefundOrExchangeRequestType;
}

export interface CompleteRefundBySellerType {
  completeRefundBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface CompleteRefundBySellerInputType {
  orderItemIds: Array<number>;
  orderByShopId: number;
  cause: Cause;
  isDistant: boolean;
  totalProductAmount: number;
  initialShipmentAmount: number;
  initialShipmentDistantAmount: number;
  shipmentRefundAmount: number;
  shipmentRefundDistantAmount: number;
}
