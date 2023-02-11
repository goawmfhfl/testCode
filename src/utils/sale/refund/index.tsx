import { Cause, MainReason } from "@constants/sale";
import { OrderItems, ResetOrderItemType } from "@models/sale";
import {
  getOption,
  getPaymentsInfo,
  getShipmentDistantPrice,
  getShipmentPrice,
  getStatusReason,
} from "..";

export const getHandleCompleteRefundErrorCase = (
  checkedOrderItems: Array<ResetOrderItemType>
) => {
  return checkedOrderItems.reduce(
    (result, { isBundleShipment, cause }, index, array) => {
      let hasBundleShipment;
      let hasIndividualShipment;
      let isClientCause;
      let isSellerCause;

      const order = array[0].merchantUid;
      const hasFilteredOrders = array.filter(
        ({ merchantUid }) => merchantUid !== order
      );
      if (hasFilteredOrders.length === 0) {
        result.hasDiffrentOrder = false;
      }

      if (isBundleShipment) {
        hasBundleShipment = true;
      }

      if (!isBundleShipment) {
        hasIndividualShipment = true;
      }

      if (hasBundleShipment && hasIndividualShipment) {
        result.hasDifferentShipmentType = true;
      }

      if (cause === Cause.CLIENT) {
        isClientCause = true;
      }

      if (cause === Cause.SELLER) {
        isSellerCause = true;
      }

      if (isClientCause && isSellerCause) {
        result.hasDifferentCause = true;
      }

      return result;
    },
    {
      hasDiffrentOrder: true,
      hasDifferentShipmentType: false,
      hasDifferentCause: false,
    }
  );
};

export const getRefundInformation = (
  checkedOrderItems: Array<ResetOrderItemType>,
  totalOrderItems: Array<OrderItems>
) => {
  return checkedOrderItems.reduce(
    (result, { id }) => {
      const orderItemIndex = totalOrderItems.findIndex(
        (totalOrderItem) => totalOrderItem.id === id
      );

      const {
        orderByShop,
        options,
        quantity,
        discountAppliedPrice,
        originalPrice,
        shipmentPrice,
        shipmentDistantPrice,
        shipmentType,
        statusReasons,
        isBundleShipment,
      } = totalOrderItems[orderItemIndex];

      const { mainReason, detailedReason, cause } =
        getStatusReason(statusReasons);

      const { optionPrice, optionQuantity } = getOption(options);

      const calculateShipmentPrice: number = getShipmentPrice(
        isBundleShipment,
        shipmentPrice,
        shipmentType,
        orderByShop
      );
      const calculateShipmentDistantPrice: number = getShipmentDistantPrice(
        isBundleShipment,
        shipmentDistantPrice,
        orderByShop
      );

      const { totalPaymentAmount } = getPaymentsInfo(
        originalPrice,
        discountAppliedPrice,
        quantity,
        optionPrice,
        optionQuantity,
        calculateShipmentPrice,
        calculateShipmentDistantPrice
      );

      result.cause = cause;
      result.totalPaymentAmount += totalPaymentAmount;
      result.shipmentPrice =
        cause === Cause.CLIENT
          ? Math.max(shipmentPrice + shipmentDistantPrice, result.shipmentPrice)
          : 0;
      result.mainReason = mainReason;
      result.detailedReason = detailedReason;

      return result;
    },
    {
      cause: Cause.DEFAULT,
      totalPaymentAmount: 0,
      shipmentPrice: 0,
      mainReason: "",
      detailedReason: "",
    }
  );
};
