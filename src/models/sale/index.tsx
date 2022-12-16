import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";
import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";

export interface CancelOrderItemsBySellerType {
  cancelOrderItemsBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface CancelOrderItemsBySellerInputType {
  orderItemIds: Array<number>;
  reason: string;
}

export interface SendOrderItemsType {
  sendOrderItems: {
    ok: boolean;
    error?: string;
  };
}

export interface SendOrderItemsInputType {
  shipmentCompany: string;
  shipmentNumber: number;
  orderItemIds: Array<number>;
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
  shipmentCompany: string;
  // 운송장번호
  invoiceNumber?: string;
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
  isChecked: boolean;
  temporaryShipmentCompany: string;
  temporaryShipmentNumber: string;
}
