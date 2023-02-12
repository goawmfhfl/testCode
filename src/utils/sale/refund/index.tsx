import { Cause, MainReason, ShipmentType } from "@constants/sale";
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
      const order = array[0].merchantUid;
      const hasFilteredOrders = array.filter(
        ({ merchantUid }) => merchantUid !== order
      );
      if (hasFilteredOrders.length === 0) {
        result.hasDiffrentOrder = false;
      }

      if (isBundleShipment) {
        result.hasBundleShipment = true;
      }

      if (!isBundleShipment) {
        result.hasIndividualShipment = true;
      }

      if (result.hasBundleShipment && result.hasIndividualShipment) {
        result.hasDifferentShipmentType = true;
      }

      if (cause === Cause.CLIENT) {
        result.isClientCause = true;
      }

      if (cause === Cause.SELLER) {
        result.isSellerCause = true;
      }

      if (result.isClientCause && result.isSellerCause) {
        result.hasDifferentCause = true;
      }

      return result;
    },
    {
      isClientCause: false,
      isSellerCause: false,
      hasBundleShipment: false,
      hasIndividualShipment: false,

      hasDiffrentOrder: false,
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

      const { totalPrice } = getPaymentsInfo(
        originalPrice,
        discountAppliedPrice,
        quantity,
        optionPrice,
        optionQuantity,
        calculateShipmentPrice,
        calculateShipmentDistantPrice
      );

      result.cause = cause;
      result.mainReason = mainReason;
      result.detailedReason = detailedReason;
      result.totalPrice += totalPrice;

      if (cause === Cause.SELLER) {
        result.shipmentPrice = 0;
        result.shipmentDistantPrice = calculateShipmentDistantPrice;
      }

      if (cause === Cause.CLIENT) {
        if (
          orderByShop.bundleShipmentType === ShipmentType.FREE ||
          orderByShop.bundleShipmentType === ShipmentType.CHARGE
        ) {
          result.shipmentPrice = Math.max(
            calculateShipmentPrice,
            result.shipmentPrice
          );
          result.shipmentDistantPrice = calculateShipmentDistantPrice;
        }

        if (orderByShop.bundleShipmentType === ShipmentType.CONDITIONAL_FREE) {
          result.expensiveShipmentPrice = Math.max(
            orderByShop.bundleShipmentPrice,
            result.expensiveShipmentPrice
          );
          result.shipmentDistantPrice = calculateShipmentDistantPrice;

          const isConditionalShipmentPriceFree =
            orderByShop.bundleOrderItemTotalPrice - result.totalPrice >=
            orderByShop.shipmentConditionalPrice;

          if (isConditionalShipmentPriceFree) {
            result.shipmentPrice = 0;
            result.isConditionalFree = true;
          }

          if (!isConditionalShipmentPriceFree) {
            result.shipmentPrice = result.expensiveShipmentPrice;
            result.isConditionalFree = false;
          }
        }
      }

      return result;
    },
    {
      cause: Cause.DEFAULT,
      totalPrice: 0,
      shipmentPrice: 0,
      shipmentDistantPrice: 0,
      mainReason: "",
      detailedReason: "",
      isConditionalFree: false,
      expensiveShipmentPrice: 0,
    }
  );
};
