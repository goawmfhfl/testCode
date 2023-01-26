import {
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentType,
} from "@constants/sale";

import { OrderItems } from "@models/sale/index";

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

export interface ResetCancelOrderItems {
  id: number;
  merchantUid: string;
  merchantItemUid: string;
  thumbnail: string;
  productName: string;
  userName: string;
  claimStatus: string;
  orderStatus: string;
  paidAt: string;
  requestCancelAt: string;
  mainReason: string;
  detailedReason: string;
  completedCancelAt: string;
  optionName: string;
  optionQuantity: number;
  originalPrice: string;
  optionPrice: string;
  discountPrice: string;
  totalPrice: string;
  shipmentPrice: string;
  shipmentDistantPrice: string;
  totalPaymentAmount: string;
  totalRefundAmout: string;
  userEmail: string;
  userPhoneNumber: string;
  recipientName: string;
  recipientPhoneNumber: string;
  refusalCancelAt: string;
  refusalReason: string;
  refusalDateaildReason: string;

  isChecked: boolean;
  colorIndex: number;
  rowIndex: string;
  isLastRow: boolean;
  isFirstRow: boolean;
}
