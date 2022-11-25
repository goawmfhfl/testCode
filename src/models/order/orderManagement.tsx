import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";

export interface FilterOptionVarType {
  type?: OrderSearchType;
  statusName?: OrderStatusName;
  statusType?: OrderStatusType;
  statusGroup: OrderStatusGroup;
}

export enum OrderStatusGroup {
  ORDER = "ORDER",
  CANCEL = "CANCEL",
  REFUND = "REFUND",
  EXCHANGE = "EXCHANGE",
}

export enum OrderStatusType {
  ORDER = "ORDER",
  CLAIM = "CLAIM",
}

export enum OrderSearchType {
  RECIPIENT_NAME = "RECIPIENT_NAME",
  RECIPIENT_PHONE_NUMBER = "RECIPIENT_PHONE_NUMBER",
  MERCHANT_UID = "MERCHANT_UID",
}

export enum OrderStatusName {
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  SHIPPING_COMPLETED = "SHIPPING_COMPLETED",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  CANCEL_ERROR = "CANCEL_ERROR",
  CANCEL_REFUSAL = "CANCEL_REFUSAL",
  REFUND_REQUEST = "REFUND_REQUEST",
  REFUND_PICK_UP_IN_PROGRESS = "REFUND_PICK_UP_IN_PROGRESS",
  REFUND_PICK_UP_COMPLETED = "REFUND_PICK_UP_COMPLETED",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_REFUSAL = "REFUND_REFUSAL",
  REFUND_ERROR = "REFUND_ERROR",
  EXCHANGE_REQUEST = "EXCHANGE_REQUEST",
  EXCHANGE_PICK_UP_IN_PROGRESS = "EXCHANGE_PICK_UP_IN_PROGRESS",
  EXCHANGE_PICK_UP_COMPLETED = "EXCHANGE_PICK_UP_COMPLETED",
  SHIPPING_AGAIN = "SHIPPING_AGAIN",
  EXCHANGE_COMPLETED = "EXCHANGE_COMPLETED",
  EXCHANGE_REFUSAL = "EXCHANGE_REFUSAL",
  EXCHANGE_ERROR = "EXCHANGE_ERROR",
  CONFIRM_PURCHASE = "CONFIRM_PURCHASE",
  PICK_UP_IN_PROGRESS = "PICK_UP_IN_PROGRESS",
  PICK_UP_COMPLETED = "PICK_UP_COMPLETED",
}

export interface SearchQueryType {
  id: number;
  label: string;
  value: string;
}

export const searchQueryType: Array<SearchQueryType> = [
  { id: 0, label: "구매자명", value: "BUYER_NAME" },
  { id: 1, label: "구매자 전화번호", value: "BUYER_PHONE_NUMBER" },
  { id: 2, label: "주문번호", value: "ORDER_NUMBER" },
];

export interface NormalizedListType {
  orders: {
    allIds: Array<number>;
    byId: { [key: number]: OrderItemsType };
  };
}

// need Change Type
export interface caculatedOrderItemType {
  orderId: number;
  paymentDay: string;
  merchantitemUid: string;
  productCode: string;
  orderProduct: string;
  quantity: number;
  price: number;
  option: string;
  optionPrice: string;
  totalPrice: string;
  courier: string;
  invoiceNumber: string;
  shipmentPrice: number;
  shipmentDistantPrice: string;
  orderState: string;
  claimState: string;
  recipientName: string;
  recipientPhoneNumber: string;
  address: string;
  postCode: number;
  shipmentMemo: string;
  sellerId: string;
  sellerName: string;
  sellerPhoneNumber: string;
}
