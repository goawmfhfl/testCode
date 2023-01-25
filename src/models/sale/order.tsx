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
  rowIndex: string;
  colorIndex: number;
  isLastRow: boolean;
  isFirstRow: boolean;

  id: number;
  merchantUid: string;
  merchantItemUid: string;
  isBundleShipment: boolean;

  product: {
    thumbnail: string;
    name: string;
  };

  user: {
    name: string;
    email: string;
    phoneNumber: string;
  };

  orderByShop: {
    bundleShipmentPrice: number;
    bundleShipmentDistantPrice: number;
    bundleShipmentType: ShipmentType;
    bundleOrderItemTotalPrice: number;
    shipmentConditionalPrice: number;

    order: {
      recipientName: string;
      recipientPhoneNumber: string;
      recipientAddress: string;
      postCode: number;
      shipmentMemo?: string;
      paidAt: string;
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

  quantity: number;
  discountAppliedPrice: number;
  originalPrice: number;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentType: ShipmentType;
  orderShipmentInfos: Array<{
    id: number;
    shipmentNumber: number;
    shipmentCompany: string;
    status: ShipmentStatus;
  }>;

  orderStatus: {
    name: OrderStatusName;
  };
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
  merchantUid: string;
  merchantItemUid: string;
  thumbnail: string;
  orderProduct: string;
  userName: string;
  orderStatus: string;
  claimStatus: string;
  orderShipmentInfosId?: number;
  shipmentCompany?: string;
  shipmentNumber?: number;
  paidAt: string;
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
  isLastRow: boolean;
  isFirstRow: boolean;
}
