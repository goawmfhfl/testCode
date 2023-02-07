import {
  MainReason,
  mainReasonType,
  OrderStatusName,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";
import { DateType, getDateFormat } from "@utils/date";

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
  const resetDiscountPrice =
    (discountAppliedPrice - originalPrice) * resetQuantity;
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
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;

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
    amount: number;
    refusalAt: string;
    refusalReason: string;
    refusalDetailedReason: string;
    attachedImages: Array<{ url: string }>;
  } = {
    requestAt: "",
    completedAt: "",
    mainReason: "",
    detailedReason: "",
    amount: 0,
    refusalAt: "",
    refusalReason: "",
    refusalDetailedReason: "",
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
        createdAt,
        amount,
        mainReason,
        detailedReason,
        status,
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
        result.mainReason = mainReasonType[mainReason];
        result.detailedReason = detailedReason;
        result.requestAt = `${
          getDateFormat(createdAt, DateType.DEFAULT).YYYY_MM_DD
        } / ${getDateFormat(createdAt, DateType.DEFAULT).HH_MM_SS}`;
        result.attachedImages = uploadedFileUrls;
      }

      if (
        status === OrderStatusName.CANCEL_COMPLETED ||
        status === OrderStatusName.REFUND_COMPLETED ||
        status === OrderStatusName.EXCHANGE_COMPLETED
      ) {
        result.completedAt = `${
          getDateFormat(createdAt, DateType.DEFAULT).YYYY_MM_DD
        } / ${getDateFormat(createdAt, DateType.DEFAULT).HH_MM_SS}`;
        result.amount = amount;
      }

      if (
        status === OrderStatusName.CANCEL_REFUSAL ||
        status === OrderStatusName.REFUND_REFUSAL ||
        status === OrderStatusName.EXCHANGE_REFUSAL
      ) {
        result.refusalReason = mainReasonType[mainReason];
        result.refusalDetailedReason = detailedReason;
        result.refusalAt = `${
          getDateFormat(createdAt, DateType.DEFAULT).YYYY_MM_DD
        } / ${getDateFormat(createdAt, DateType.DEFAULT).HH_MM_SS}`;
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
    exchangeOrderId?: number;
    exchangeShipmentCompany?: string;
    exchangeShipmentNumber?: number;
    exchangeAgainOrderId?: number;
    exchangeAgainShipmentCompany?: string;
    exchangeAgainShipmentNumber?: number;
  } = {
    shipmentOrderId: null,
    shipmentCompany: null,
    shipmentNumber: null,
    refundOrderId: null,
    refundShipmentCompany: null,
    refundShipmentNumber: null,
    exchangeOrderId: null,
    exchangeShipmentCompany: null,
    exchangeShipmentNumber: null,
    exchangeAgainOrderId: null,
    exchangeAgainShipmentCompany: null,
    exchangeAgainShipmentNumber: null,
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
          result.exchangeOrderId = id;
          result.exchangeShipmentCompany = shipmentCompany;
          result.exchangeShipmentNumber = shipmentNumber;
        }

        if (status === ShipmentStatus.EXCHANGE_PICK_UP_AGAIN) {
          result.exchangeAgainOrderId = id;
          result.exchangeAgainShipmentCompany = shipmentCompany;
          result.exchangeAgainShipmentNumber = shipmentNumber;
        }

        return result;
      },
      orderShipmentInfoInitailValue
    );
  }
};
