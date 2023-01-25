import {
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentType,
} from "@constants/sale";

export interface CancelOrdersType {
  rowIndex?: string;
  colorIndex?: number;
  isLastRow?: boolean;
  isFirstRow?: boolean;

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

  statusReasons: Array<{
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
  }>;

  orderByShop: {
    bundleShipmentPrice: number;
    bundleShipmentDistantPrice: number;
    bundleShipmentType: ShipmentType;
    bundleOrderItemTotalPrice: number;
    shipmentConditionalPrice: number;

    order: {
      recipientName: string;
      recipientPhoneNumber: string;
      postCode: number;
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
