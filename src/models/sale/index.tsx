import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";

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
  { id: 0, label: "구매자명", value: OrderSearchType.RECIPIENT_NAME },
  {
    id: 1,
    label: "구매자 전화번호",
    value: OrderSearchType.RECIPIENT_PHONE_NUMBER,
  },
  { id: 2, label: "주문번호", value: OrderSearchType.MERCHANT_UID },
];

export interface NormalizedListType {
  orders: {
    allIds: Array<number>;
    byId: { [key: number]: OrderItemsType };
  };
}

// need Change Type
export interface ResetOrderItemType {
  id: number;
  // 주문번호
  merchantItemUid: string;
  // 상품 주문번호
  productCode: string;
  // 주문 상품
  thumbnail: string;
  orderProduct: string;
  // 구매자 명
  userName: string;
  // 주문 상태
  orderStatus: string;
  // 클레임 상태
  claimStatus: string;
  // 택배사
  courier: string;
  // 운송장번호
  invoiceNumber: string;
  // 결제일
  payments: string;
  // 수취인
  recipientName: string;
  // 수취인 전화번호
  recipientPhoneNumber: string;
  // 수취인 주소
  recipientAddress: string;
  // 우편번호
  postCode: string | number;
  // 배송메세지
  shipmentMemo: string;
  // 구매자 아이디
  userEmail: string;
  // 구매자 전화번호
  userPhoneNumber: string;
  // 옵션
  option: string;
  // 상품개수
  quantity: number;
  // 상품가
  price: number;
  // 옵션가
  optionPrice: string;
  // 상품별 총 금액
  totalPrice: string;
  // 배송비
  shipmentPrice: number;
  // 제주/도서 추가배송비
  shipmentDistantPrice: number;
}
