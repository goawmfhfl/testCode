import {
  MainReason,
  mainReasonType,
  OrderStatusName,
  ShipmentType,
} from "@constants/sale";
import { getDateFormat } from "@utils/date";

export const getStatusReason = (
  statusReason: Array<{
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
  }>
) => {
  const statusReasonInitailValue = {
    requestCancelAt: "",
    completedCancelAt: "",
    mainReason: "",
    detailedReason: "",
    amount: 0,
    refusalCancelAt: "",
    refusalReason: "",
    refusalDateaildReason: "",
  };

  const hasStatusReason = !!statusReason && !!statusReason.length;
  if (!hasStatusReason) {
    return {
      requestCancelAt: "",
      completedCancelAt: "",
      mainReason: "",
      detailedReason: "",
      amount: 0,
      refusalCancelAt: "",
      refusalReason: "",
      refusalDateaildReason: "",
    };
  }

  return statusReason.reduce(
    (result, { createdAt, amount, mainReason, detailedReason, status }) => {
      if (
        status === OrderStatusName.CANCEL_REQUEST ||
        status === OrderStatusName.CANCEL_COMPLETED
      ) {
        result.mainReason = mainReasonType[mainReason];
        result.detailedReason = detailedReason;
        result.requestCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
      }

      if (status === OrderStatusName.CANCEL_COMPLETED) {
        result.completedCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
        result.amount = amount;
      }

      if (status === OrderStatusName.CANCEL_REFUSAL) {
        result.refusalReason = mainReasonType[mainReason];
        result.refusalDateaildReason = detailedReason;
        result.refusalCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
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

  return options.reduce((result, { components, quantity, price }) => {
    result.optionName += components.reduce((component, { name, value }) => {
      if (component) {
        component += `/ ${name} : ${value} `;
      }
      if (!component) {
        component = `${name} : ${value} `;
      }
      return component;
    }, "");

    result.optionQuantity = quantity;
    result.optionPrice = quantity * price;

    return result;
  }, optioninitailValue);
};

export const getDiscountPrice = (
  originalPrice: number,
  discountAppliedPrice: number
) => {
  if (!discountAppliedPrice) return 0;

  return discountAppliedPrice - originalPrice;
};

export const getTotalPrice = (
  originalPrice: number,
  discountAppliedPrice: number,
  optionPrice: number
) => {
  return originalPrice + optionPrice + discountAppliedPrice;
};

export const getShipmentPrice = (
  isBundleShipment: boolean,
  shipmentPrice: number,
  shipmentType: ShipmentType,
  bundleShipmentPrice: number,
  bundleShipmentType: ShipmentType,
  bundleOrderItemTotalPrice: number,
  shipmentConditionalPrice: number
) => {
  if (!shipmentPrice) return 0;

  if (!isBundleShipment) {
    if (shipmentType === ShipmentType.FREE) {
      return 0;
    }
    if (shipmentType === ShipmentType.CHARGE) {
      return shipmentPrice;
    }
  }

  if (isBundleShipment) {
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

export const getTotalPaymentAmount = (
  originalPrice: number,
  discountAppliedPrice: number,
  optionPrice: number,
  shipmentPrice: number,
  shipmentDistantPrice: number
) => {
  const result =
    originalPrice +
    discountAppliedPrice +
    optionPrice +
    shipmentPrice +
    shipmentDistantPrice;
  return result;
};
