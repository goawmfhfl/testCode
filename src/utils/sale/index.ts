import {
  Cause,
  MainReason,
  mainReasonType,
  OrderStatusGroup,
  OrderStatusName,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";
import { ResetOrderItemType } from "@models/sale";
import { DateType, getDateFormat } from "@utils/date";

export const getOrderGroupCounter = (orderStatus: Array<OrderStatusGroup>) => {
  return orderStatus.reduce(
    (result, status) => {
      if (status === OrderStatusGroup.ORDER) {
        result.order++;
      }
      if (status === OrderStatusGroup.CANCEL) {
        result.cancel++;
      }
      if (status === OrderStatusGroup.REFUND) {
        result.refund++;
      }
      if (status === OrderStatusGroup.EXCHANGE) {
        result.exchange++;
      }

      return result;
    },
    {
      order: 0,
      cancel: 0,
      refund: 0,
      exchange: 0,
    }
  );
};

export const getIsCheckedStatus = (
  checkedOrderItems: Array<ResetOrderItemType>
) => {
  return checkedOrderItems.reduce(
    (result, { claimStatus }) => {
      if (claimStatus === "반품 요청") {
        result.isRefundRequestChecked = true;
        result.refundRequestCount++;
      }
      if (claimStatus === "수거중") {
        result.isPickupInProgressChecked = true;
        result.pickupInProgressCount++;
      }
      if (claimStatus === "수거완료") {
        result.isPickupCompletedChecked = true;
        result.pickupCompletedCount++;
      }
      if (claimStatus === "교환 요청") {
        result.isExchangeRequestChecked = true;
        result.exchangeRequestCount++;
      }

      if (claimStatus === "재발송") {
        result.isShippingAgainChecked = true;
        result.shippingAgainCount++;
      }

      if (claimStatus === "교환 완료") {
        result.isExchangeCompletedChecked = true;
        result.exchangeCompletedCount++;
      }

      return result;
    },
    {
      isRefundRequestChecked: false,
      refundRequestCount: 0,

      isPickupInProgressChecked: false,
      pickupInProgressCount: 0,

      isPickupCompletedChecked: false,
      pickupCompletedCount: 0,

      isRefundCompletedChecked: false,
      refundCompletedCount: 0,

      isExchangeRequestChecked: false,
      exchangeRequestCount: 0,

      isShippingAgainChecked: false,
      shippingAgainCount: 0,

      isExchangeCompletedChecked: false,
      exchangeCompletedCount: 0,
    }
  );
};

export const getOrdersLength = (
  orders: Array<{
    orderStatus: { name: OrderStatusName };
    claimStatus: { name: OrderStatusName };
  }>
) => {
  return orders.reduce(
    (result, { claimStatus }) => {
      if (claimStatus.name === OrderStatusName.CANCEL_REQUEST) {
        result.cancelRequest++;
      }

      if (claimStatus.name === OrderStatusName.CANCEL_COMPLETED) {
        result.cancelCompleted++;
      }

      if (claimStatus.name === OrderStatusName.REFUND_REQUEST) {
        result.refundRequest++;
      }

      if (claimStatus.name === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS) {
        result.refundPickUpInProgress++;
      }

      if (claimStatus.name === OrderStatusName.REFUND_PICK_UP_COMPLETED) {
        result.refundPickUpCompleted++;
      }

      if (claimStatus.name === OrderStatusName.REFUND_COMPLETED) {
        result.refundCompleted++;
      }

      if (claimStatus.name === OrderStatusName.EXCHANGE_REQUEST) {
        result.exchangeReqeust++;
      }

      if (claimStatus.name === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS) {
        result.exchangePickupInProgress++;
      }

      if (claimStatus.name === OrderStatusName.EXCHANGE_PICK_UP_COMPLETED) {
        result.exchangePickupCompleted++;
      }

      if (claimStatus.name === OrderStatusName.SHIPPING_AGAIN) {
        result.shippingAgain++;
      }

      if (claimStatus.name === OrderStatusName.EXCHANGE_COMPLETED) {
        result.exchangeCompleted++;
      }

      return result;
    },
    {
      cancelRequest: 0,
      cancelCompleted: 0,
      refundRequest: 0,
      refundPickUpInProgress: 0,
      refundPickUpCompleted: 0,
      refundCompleted: 0,
      exchangeReqeust: 0,
      exchangePickupInProgress: 0,
      exchangePickupCompleted: 0,
      shippingAgain: 0,
      exchangeCompleted: 0,
    }
  );
};

export const getPaymentsInfo = (
  originalPrice: number,
  discountAppliedPrice: number,
  quantity: number,
  optionPirce: number,
  optionQuantity: number,
  shipmentPrice: number,
  shipmentDistantPrice: number
) => {
  originalPrice = originalPrice ?? 0;
  discountAppliedPrice = discountAppliedPrice ?? 0;
  quantity = quantity ?? 0;
  optionPirce = optionPirce ?? 0;
  optionQuantity = optionQuantity ?? 0;
  shipmentPrice = shipmentPrice ?? 0;
  shipmentDistantPrice = shipmentDistantPrice ?? 0;

  const resetQuantity = quantity ? quantity : optionQuantity;
  const resetOriginalPrice = originalPrice * resetQuantity;
  const resetDiscountPrice = discountAppliedPrice
    ? (discountAppliedPrice - originalPrice) * resetQuantity
    : 0;
  const resetOptionPrice = optionPirce * optionQuantity;
  const totalPrice = resetOriginalPrice + resetOptionPrice + resetDiscountPrice;
  const totalPaymentAmount = totalPrice + shipmentPrice + shipmentDistantPrice;

  return {
    resetQuantity,
    resetOriginalPrice,
    resetDiscountPrice,
    resetOptionPrice,
    totalPrice,
    totalPaymentAmount,
  };
};

export const getStatusReason = (
  statusReason: Array<{
    id: number;
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
    cause: Cause;

    uploadedFileUrls: Array<{
      url: string;
    }>;
  }>
) => {
  const statusReasonInitailValue: {
    requestAt: string;
    completedAt: string;
    mainReason: string;
    detailedReason: string;
    reasonStatus: OrderStatusName;
    statusReasonId: number;
    amount: number;
    cause: Cause;
    refusalAt: string;
    refusalReason: string;
    refusalDetailedReason: string;
    refusalReasonStatus: OrderStatusName;
    refusalStatusReasonId: number;
    refusalCause: Cause;
    attachedImages: Array<{ url: string }>;
  } = {
    requestAt: "",
    completedAt: "",
    mainReason: "",
    detailedReason: "",
    reasonStatus: null,
    refusalStatusReasonId: null,
    amount: 0,
    cause: null,
    refusalAt: "",
    refusalReason: "",
    refusalDetailedReason: "",
    refusalReasonStatus: null,
    statusReasonId: null,
    refusalCause: null,
    attachedImages: [],
  };

  const hasStatusReason = !!statusReason && !!statusReason.length;
  if (!hasStatusReason) {
    return statusReasonInitailValue;
  }

  return statusReason.reduce(
    (
      result,
      {
        id,
        createdAt,
        amount,
        mainReason,
        detailedReason,
        status,
        cause,
        uploadedFileUrls,
      }
    ) => {
      if (
        status === OrderStatusName.CANCEL_REQUEST ||
        status === OrderStatusName.CANCEL_COMPLETED ||
        status === OrderStatusName.REFUND_REQUEST ||
        status === OrderStatusName.REFUND_COMPLETED ||
        status === OrderStatusName.EXCHANGE_REQUEST ||
        status === OrderStatusName.EXCHANGE_COMPLETED
      ) {
        result.statusReasonId = id;
        result.mainReason = mainReasonType[mainReason];
        result.detailedReason = detailedReason;
        result.reasonStatus = status;
        result.requestAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
        result.cause = cause;
        result.attachedImages = uploadedFileUrls;
      }

      if (
        status === OrderStatusName.CANCEL_COMPLETED ||
        status === OrderStatusName.REFUND_COMPLETED ||
        status === OrderStatusName.EXCHANGE_COMPLETED
      ) {
        result.completedAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
        result.amount = amount;
      }

      if (
        status === OrderStatusName.CANCEL_REFUSAL ||
        status === OrderStatusName.REFUND_REFUSAL ||
        status === OrderStatusName.EXCHANGE_REFUSAL
      ) {
        result.refusalStatusReasonId = id;
        result.refusalReason = mainReasonType[mainReason];
        result.refusalDetailedReason = detailedReason;
        result.refusalReasonStatus = status;
        result.refusalCause = cause;
        result.refusalAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
      }

      return result;
    },
    statusReasonInitailValue
  );
};

export const getOption = (
  options: Array<{
    id: number;
    components: Array<{
      name: string;
      value: string;
    }>;
    quantity: number;
    price: number;
    isRequired: boolean;
  }>
) => {
  const optioninitailValue = {
    optionName: "",
    optionPrice: 0,
    optionQuantity: 0,
  };

  const hasOption = !!options && !!options.length;

  if (!hasOption)
    return {
      optionName: "",
      optionPrice: 0,
      optionQuantity: 0,
    };

  if (hasOption) {
    return options.reduce((result, { components, quantity, price }) => {
      const hasComponents = !!components && !!components.length;

      if (hasComponents) {
        result.optionName += components.reduce((component, { name, value }) => {
          if (component) {
            component += `/ ${name} : ${value} `;
          }
          if (!component) {
            component = `${name} : ${value} `;
          }
          return component;
        }, "");
      }

      if (!hasComponents) {
        result.optionName = "";
      }

      result.optionQuantity = quantity;
      result.optionPrice = price;

      return result;
    }, optioninitailValue);
  }
};

export const getShipmentPrice = (
  isBundleShipment: boolean,
  shipmentPrice: number,
  shipmentType: ShipmentType,
  orderByShop: {
    bundleShipmentPrice: number;
    bundleShipmentType: ShipmentType;
    bundleOrderItemTotalPrice: number;
    shipmentConditionalPrice: number;
  }
) => {
  const hasOrderByShop = !!orderByShop && !!orderByShop.bundleShipmentType;

  if (!isBundleShipment) {
    shipmentPrice = shipmentPrice ?? 0;
    if (shipmentType === ShipmentType.FREE) {
      return 0;
    }
    if (shipmentType === ShipmentType.CHARGE) {
      return shipmentPrice;
    }
  }

  if (isBundleShipment && hasOrderByShop) {
    const {
      bundleShipmentType,
      bundleShipmentPrice,
      bundleOrderItemTotalPrice,
      shipmentConditionalPrice,
    } = orderByShop;

    if (bundleShipmentType === ShipmentType.FREE) {
      return 0;
    }
    if (bundleShipmentType === ShipmentType.CHARGE) {
      return bundleShipmentPrice;
    }
    if (bundleShipmentType === ShipmentType.CONDITIONAL_FREE) {
      const isConditionalFree =
        bundleOrderItemTotalPrice > shipmentConditionalPrice;

      return isConditionalFree ? 0 : bundleShipmentPrice;
    }
  }
};

export const getShipmentDistantPrice = (
  isBundleShipment: boolean,
  shipmentDistantPrice: number,
  orderByShop: {
    bundleShipmentDistantPrice: number;
    bundleShipmentType: ShipmentType;
  }
) => {
  const hasOrderByShop = !!orderByShop && !!orderByShop.bundleShipmentType;

  if (isBundleShipment && hasOrderByShop) {
    return orderByShop.bundleShipmentDistantPrice ?? 0;
  }

  if (!isBundleShipment) {
    return shipmentDistantPrice ?? 0;
  }
};

export const getShipmentInfos = (
  orderShipmentInfos: Array<{
    id: number;
    shipmentNumber: number;
    shipmentCompany: string;
    status: ShipmentStatus;
  }>
) => {
  const orderShipmentInfoInitailValue: {
    shipmentOrderId?: number;
    shipmentCompany?: string;
    shipmentNumber?: number;
    refundOrderId?: number;
    refundShipmentCompany?: string;
    refundShipmentNumber?: number;
    pickupOrderId?: number;
    pickupShipmentCompany?: string;
    pickupShipmentNumber?: number;
    pickupAgainOrderId?: number;
    pickupAgainShipmentCompany?: string;
    pickupAgainShipmentNumber?: number;
  } = {
    shipmentOrderId: null,
    shipmentCompany: null,
    shipmentNumber: null,
    refundOrderId: null,
    refundShipmentCompany: null,
    refundShipmentNumber: null,
    pickupOrderId: null,
    pickupShipmentCompany: null,
    pickupShipmentNumber: null,
    pickupAgainOrderId: null,
    pickupAgainShipmentCompany: null,
    pickupAgainShipmentNumber: null,
  };
  const hasOrderShipmentInfos =
    !!orderShipmentInfos && !!orderShipmentInfos.length;

  if (!hasOrderShipmentInfos) return orderShipmentInfoInitailValue;

  if (hasOrderShipmentInfos) {
    return orderShipmentInfos.reduce(
      (result, { id, shipmentCompany, shipmentNumber, status }) => {
        if (status === ShipmentStatus.SHIPPING) {
          result.shipmentOrderId = id;
          result.shipmentCompany = shipmentCompany;
          result.shipmentNumber = shipmentNumber;
        }

        if (status === ShipmentStatus.REFUND_PICK_UP) {
          result.refundOrderId = id;
          result.refundShipmentCompany = shipmentCompany;
          result.refundShipmentNumber = shipmentNumber;
        }

        if (status === ShipmentStatus.EXCHANGE_PICK_UP) {
          result.pickupOrderId = id;
          result.pickupShipmentCompany = shipmentCompany;
          result.pickupShipmentNumber = shipmentNumber;
        }

        if (status === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
          result.pickupAgainOrderId = id;
          result.pickupAgainShipmentCompany = shipmentCompany;
          result.pickupAgainShipmentNumber = shipmentNumber;
        }

        return result;
      },
      orderShipmentInfoInitailValue
    );
  }
};
