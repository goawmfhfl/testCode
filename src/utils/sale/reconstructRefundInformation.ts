import { Cause, ShipmentType } from "@constants/sale";

interface ReconstructRefundInformationType {
  totalProductAmount: number;
  initialShipmentAmount: number;
  initialShipmentDistantAmount: number;
  shipmentRefundAmount: number;
  bundleShipmentType: ShipmentType;
  isConditionalAmountBreak: boolean;
  isAllOrderItemRefunded: boolean;
  isFreeBreak: boolean;
}

const reconstructRefundInformation = (
  refundInformation: ReconstructRefundInformationType,
  cause: Cause
) => {
  const {
    totalProductAmount,

    initialShipmentAmount,
    initialShipmentDistantAmount,
    shipmentRefundAmount,

    bundleShipmentType,
    isConditionalAmountBreak,
    isFreeBreak,
    isAllOrderItemRefunded,
  } = refundInformation;

  const isFree = bundleShipmentType === ShipmentType.FREE;
  const isCharge = bundleShipmentType === ShipmentType.CHARGE;
  const isConditionalFree =
    bundleShipmentType === ShipmentType.CONDITIONAL_FREE;

  let calculatedInitialShipmentAmount: number;
  let calculatedInitialShipmentDistantAmount: number;
  let calculatedShipmentRefundAmount: number;
  let sign: string;

  if (cause === Cause.CLIENT) {
    sign = "-";
    calculatedInitialShipmentDistantAmount = 0;
    calculatedShipmentRefundAmount =
      shipmentRefundAmount + initialShipmentDistantAmount;

    if (isFreeBreak) {
      if (isConditionalAmountBreak) {
        if (isCharge) {
          calculatedInitialShipmentAmount = initialShipmentDistantAmount ?? 0;
        }
      }

      if (!isConditionalAmountBreak) {
        if (isFree) {
          calculatedInitialShipmentAmount = initialShipmentDistantAmount ?? 0;
        }
        if (isCharge) {
          calculatedInitialShipmentAmount = initialShipmentDistantAmount ?? 0;
        }
        if (isConditionalFree) {
          calculatedInitialShipmentAmount = 0;
        }
      }
    }

    if (!isFreeBreak) {
      if (isConditionalAmountBreak) {
        if (isFree) {
          calculatedInitialShipmentAmount = 0;
        }
        if (isCharge) {
          calculatedInitialShipmentAmount = initialShipmentDistantAmount ?? 0;
        }
      }

      if (!isConditionalAmountBreak) {
        calculatedInitialShipmentAmount = 0;
      }
    }
  }

  if (cause === Cause.SELLER) {
    sign = "+";

    if (isAllOrderItemRefunded) {
      calculatedInitialShipmentAmount = initialShipmentAmount ?? 0;
      calculatedInitialShipmentDistantAmount =
        initialShipmentDistantAmount ?? 0;
      calculatedShipmentRefundAmount = null;
    }

    if (!isAllOrderItemRefunded) {
      calculatedInitialShipmentAmount = null;
      calculatedInitialShipmentDistantAmount = null;
      calculatedShipmentRefundAmount = null;
    }
  }

  return {
    totalProductAmount,
    initialShipmentAmount: calculatedInitialShipmentAmount,
    initialShipmentDistantAmount: calculatedInitialShipmentDistantAmount,
    shipmentRefundAmount: calculatedShipmentRefundAmount,
    sign,
  };
};

export default reconstructRefundInformation;
