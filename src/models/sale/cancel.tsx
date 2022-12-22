import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  MainReason,
} from "@constants/sale";

export interface CancelOrdersType {
  id: number;

  merchantItemUid: string;

  product: {
    code: string;
    thumbnail: string;
    name: string;
  };

  user: {
    name: string;
    email: string;
    phoneNumber: string;
    payments: {
      createdAt: string;
    };
  };

  orderByShop: {
    order: {
      recipientName: string;
      recipientPhoneNumber: string;
    };
  };

  options: Array<{
    components: Array<{
      name: string;
      value: string;
    }>;
    price: number;
  }>;

  quantity: number;

  discountAppliedPrice: number;

  originalPrice: number;

  shipmentPrice: number;

  shipmentDistantPrice: number;

  statusReasons: Array<{
    id: number;
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
  }>;

  orderStatus: {
    name: OrderStatusName;
  };

  claimStatus: {
    name: OrderStatusName;
  };
}

export interface GetCancelOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalPages: number;
    totalResults: number;
    totalOrderItems: Array<CancelOrdersType>;
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
    allIds: Array<number>;
    byId: { [key: number]: CancelOrdersType };
  };
}

export interface ResetCancelOrders {
  id: number;
  merchantItemUid: string;
  productCode: string;
  thumbnail: string;
  orderProduct: string;
  userName: string;
  mainReason: MainReason;
  detaildReason: string;
  refusalMainReason: MainReason;
  refusalDetaildReason: string;
  orderStatus: string;
  claimStatus: string;
  payments: string;
  recipientName: string;
  recipientPhoneNumber: string;
  userEmail: string;
  userPhoneNumber: string;
  option: string;
  quantity: number;
  price: number;
  optionPrice: string;
  totalPrice: string;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  cancelRequestDay: string;
  cancelRefusalDay: string;
  cancelCompletedDay: string;
  totalRefundPrice: number;
  isChecked: boolean;
}
