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
