import {
  Cause,
  MainReason,
  OrderSearchType,
  OrderStatusName,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";

export interface NormalizedListType {
  orderItems: {
    allIds: Array<string>;
    byId: { [key: string]: OrderItems };
  };
}

export interface OrderItems {
  rowIndex: string;
  colorIndex: number;
  isLastRow: boolean;
  isFirstRow: boolean;

  id: number;
  merchantUid: string;
  merchantItemUid: string;
  isBundleShipment: boolean;
  thumbnail: string;
  name: string;

  user: {
    name: string;
    email: string;
    phoneNumber: string;
  };

  statusReasons?: Array<{
    id: number;
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    cause: Cause;
    status: OrderStatusName;
    uploadedFileUrls: Array<{
      url: string;
    }>;
  }>;

  orderByShop?: {
    id: number;
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
      shipmentMemo: string;
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

  shipmentType: ShipmentType;
  shipmentPrice: number;
  shipmentDistantPrice: number;

  orderShipmentInfos?: Array<{
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

export interface ResetOrderItemType {
  id: number;
  orderByShopId?: number;
  merchantUid: string;
  merchantItemUid: string;

  thumbnail: string;
  productName: string;

  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  paidAt: string;

  orderStatus: string;
  claimStatus: string;

  shipmentOrderId?: number;
  isShipmentInfoEdit?: boolean;
  temporaryShipmentCompany?: string;
  temporaryShipmentNumber?: number;
  shipmentCompany?: string;
  shipmentNumber?: number;

  refundOrderId?: number;
  isRefundShipmentInfoEdit?: boolean;
  refundShipmentCompany?: string;
  refundShipmentNumber?: number;
  temporaryRefundShipmentCompany?: string;
  temporaryRefundShipmentNumber?: number;

  pickupOrderId?: number;
  pickupShipmentCompany?: string;
  pickupShipmentNumber?: number;

  isPickupShipmentInfoEdit?: boolean;
  temporaryPickupShipmentCompany?: string;
  temporaryPickupShipmentNumber?: number;

  pickupAgainOrderId?: number;
  pickupAgainShipmentCompany?: string;
  pickupAgainShipmentNumber?: number;

  isPickupAgainShipmentInfoEdit?: boolean;
  temporaryPickupAgainShipmentCompany?: string;
  temporaryPickupAgainShipmentNumber?: number;

  recipientName: string;
  recipientPhoneNumber: string;
  recipientAddress?: string;
  shipmentMemo?: string;
  postCode?: string | number;

  option?: string;
  quantity?: number;
  price?: string;
  originalPrice?: string;
  optionName?: string;
  optionQuantity?: number;
  optionPrice?: string | number;
  totalPrice: string;
  discountPrice: string | number;
  shipmentPrice: string;
  shipmentDistantPrice?: string | number;
  totalPaymentAmount: string;
  totalRefundAmout?: string;

  mainReason?: string;
  detailedReason?: string;
  reasonStatus?: OrderStatusName;
  statusReasonId?: number;
  requestAt?: string;
  completedAt?: string;
  refusalAt?: string;
  refusalReason?: string;
  refusalDetailedReason?: string;
  refusalReasonStatus?: OrderStatusName;
  refusalStatusReasonId?: number;
  amount?: number | string;
  attachedImages?: Array<{ url: string }> | null;

  isBundleShipment?: boolean;
  cause?: Cause;

  isChecked: boolean;

  colorIndex: number;
  rowIndex: string;
  isLastRow: boolean;
  isFirstRow: boolean;
}

export interface SkipQuantityType {
  id: number;
  label: string;
  value: number;
}

export interface FilterOptionVarType {
  type?: OrderSearchType;
}

export interface SearchQueryType {
  id: number;
  label: string;
  value: string;
}

export interface NormalizedType {
  orderItems: {
    allIds: Array<string>;
    byId: { [key: string]: OrderItems };
  };
}

export interface EditStatusReasonBySellerType {
  editStatusReasonBySeller: {
    ok: boolean;
    error?: string;
  };
}

export interface EditStatusReasonBySellerInputType {
  statusReasonId: number;
  mainReason: MainReason;
  detailedReason: string;
}

export interface ChangeOrderStatusByForceType {
  changeOrderStatusByForce: {
    ok: boolean;
    error?: string;
  };
}

export interface ChangeOrderStatusByForceInputType {
  components: Array<{ orderItemId: number }>;
  claimStatusName: OrderStatusName;
}

export interface EstimateRefundAmountType {
  estimateRefundAmount: {
    ok: boolean;
    error?: string;
    totalProductAmount: number;
    initialShipmentAmount: number;
    initialShipmentDistantAmount: number;
    shipmentRefundAmount: number;
    shipmentRefundDistantAmount: number;
    finalRefundAmount: number;
  };
}
export interface EstimateRefundAmountInputType {
  orderItemIds: Array<number>;
  orderByShopId: number;
  cause: Cause;
}
