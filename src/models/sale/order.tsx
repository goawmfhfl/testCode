import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";

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

export interface OrderItemsType {
  id: number;
  // 주문 번호
  merchantItemUid: string;

  product: {
    // 상품 번호
    code: string;
    // 상품 썸네일
    thumbnail: string;
    // 주문 상품
    name: string;
  };

  user: {
    // 유저 이름
    name: string;
    // 유저 이메일
    email: string;
    // 유저 핸드폰번호
    phoneNumber: string;
    // 유저 결제일
    payments: {
      createdAt: string;
    };
  };

  orderByShop: {
    order: {
      // 수취인 명
      recipientName: string;
      // 수취인 번호
      recipientPhoneNumber: string;
      // 수취인 주소
      recipientAddress: string;
      // 수취인 우편번호
      postCode?: number;
      // 수취인 배송메모
      shipmentMemo?: string;
    };
  };

  options: Array<{
    // 옵션명
    components: Array<{
      name: string;
      value: string;
    }>;

    // 옵션 가격
    price: number;
  }>;

  // 상품 갯수
  quantity: number;

  // 상품가
  discountAppliedPrice: number;
  originalPrice: number;

  // 배송비
  shipmentPrice: number;

  // 도서산간 배송비
  shipmentDistantPrice: number;

  // 주문상태
  orderStatus: {
    name: OrderStatusName;
  };

  // 클레임상태
  claimStatus: {
    name: OrderStatusName;
  };
}

export interface GetOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    totalOrderItems: Array<OrderItemsType>;
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
