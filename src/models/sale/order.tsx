import {
  Cause,
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentStatus,
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

export interface OrdersType {
  rowIndex?: string;
  colorIndex?: number;

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
    id: number;
    components: Array<{
      name: string;
      value: string;
    }>;

    quantity: number;
    price: number;
    isRequired: boolean;
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

  orderShipmentInfos: Array<{
    id: number;
    // 운송장번호
    shipmentNumber: number;
    // 택배사
    shipmentCompany: string;
    // 상태
    status: ShipmentStatus;
  }>;

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
    totalOrderItems: Array<OrdersType>;
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
  components: Array<{
    orderItemId: number;
    amount: number;
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

export interface NormalizedListType {
  orders: {
    allIds: Array<string>;
    byId: { [key: string]: OrdersType };
  };
}

export interface ResetOrderItemType {
  id: number;
  merchantItemUid: string;
  productCode: string;
  thumbnail: string;
  orderProduct: string;
  userName: string;
  orderStatus: string;
  claimStatus: string;
  orderShipmentInfosId?: number;
  shipmentCompany?: string;
  shipmentNumber?: number;
  payments: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientAddress: string;
  postCode: string | number;
  shipmentMemo: string;
  userEmail: string;
  userPhoneNumber: string;
  option: string;
  quantity: number;
  price: string;
  optionPrice: string | number;
  totalPrice: string;
  discountPrice: string | number;
  shipmentPrice: string;
  shipmentDistantPrice: string;
  totalPaymentAmount: string;
  isChecked: boolean;
  isShipmentInfoEdit: boolean;
  temporaryShipmentCompany: string;
  temporaryShipmentNumber?: number;
  colorIndex: number;
  rowIndex: string;
}
