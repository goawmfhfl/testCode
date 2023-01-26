import {
  MainReason,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";

export interface OrderItems {
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

  statusReasons?: Array<{
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
  shipmentPrice: number;
  shipmentDistantPrice: number;
  shipmentType: ShipmentType;

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
