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
import { RequestRefundOrExchange } from "@constants/sale/orderManagement";
import { OrderItems } from "@models/sale/index";

export interface GetOrdersBySellerInputType {
  input: {
    page?: number;
    skip?: number;
    query?: string;
    type?: OrderSearchType;
    statusName?: OrderStatusName;
    statusType?: OrderStatusType;
    statusGroup: OrderStatusGroup;
  };
}

export interface GetOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    totalOrderItems: Array<OrderItems>;
  };
}

export interface GetOrderStatusBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalOrderItems: Array<{
      orderStatus: {
        name: OrderStatusName;
      };
    }>;
  };
}

export interface GetOrderStatusBySellerInputType {
  page?: number;
  skip?: number;
  query?: string;
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup?: OrderStatusGroup;
}

export interface CancelOrderItemsBySellerType {
  cancelOrderItemsBySeller: {
    ok: boolean;
    error?: string;
    cancelAmount: number;
  };
}

export interface CancelOrderItemsBySellerInputType {
  components: Array<{
    orderItemId: number;
    mainReason: MainReason;
    detailedReason: string;
    cause: Cause;
  }>;
}

export interface EditShipmentNumberInputType {
  orderItemId: number;
  orderShipmentInfoId: number;
  shipmentCompany: string;
  shipmentNumber: number;
  status: ShipmentStatus;
}

export interface EditShipmentNumberType {
  editShipmentNumber: {
    ok: boolean;
    error?: string;
  };
}

export interface SendOrderItemsType {
  sendOrderItems: {
    ok: boolean;
    error?: string;
  };
}

export interface SendOrderItemsInputType {
  components: Array<{
    orderItemId: number;
    shipmentCompany: string;
    shipmentNumber: number;
  }>;
}

export interface ConfirmOrderItemsBySellerType {
  confirmOrderItemsBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface ConfirmOrderItemsBySellerInputType {
  orderItemIds: Array<number>;
}

export interface RequestRefundOrExchangeBySellerType {
  requestRefundOrExchangeBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface RequestRefundOrExchangeBySellerInputType {
  components: Array<{
    orderItemId: number;
    mainReason: MainReason;
    detailedReason: string;
    cause: Cause;
  }>;
  status: RequestRefundOrExchange;
}

export interface NormalizedListType {
  orders: {
    allIds: Array<string>;
    byId: { [key: string]: OrderItems };
  };
}
