export interface SkipQuantityCacheType {
  id: number;
  label: string;
  value: number;
}

export enum OrderStatus {
  NEW = "NEW",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  SHIPPING_COMPLETED = "SHIPPING_COMPLETED",
  CONFIRM_PURCHASE = "CONFIRM_PURCHASE",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  CANCEL_REFUSAL = "CANCEL_REFUSAL",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  REFUND_REQUEST = "REFUND_REQUEST",
  REFUND_REFUSAL = "REFUND_REFUSAL",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_PICK_UP_ING = "REFUND_PICK_UP_ING",
  REFUND_PICK_UP_COMPLETED = "REFUND_PICK_UP_COMPLETED",
  EXCHANGE_REQUEST = "EXCHANGE_REQUEST",
  EXCHANGE_REFUSAL = "EXCHANGE_REFUSAL",
  EXCHANGE_COMPLETED = "EXCHANGE_COMPLETED",
  EXCHANGE_PICK_UP_ING = "EXCHANGE_PICK_UP_ING",
  EXCHANGE_PICK_UP_COMPLETED = "EXCHANGE_PICK_UP_COMPLETED",
  EXCHANGE_ING = "EXCHANGE_ING",
}
