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

  let calculatedInitialShipmentAmount: number;
  let calculatedInitialShipmentDistantAmount: number;
  let calculatedShipmentRefundAmount: number;
  let sign: string;

  if (cause === Cause.CLIENT) {
    sign = "-";

    if (isConditionalAmountBreak) {
      if (bundleShipmentType === ShipmentType.CHARGE) {
        calculatedInitialShipmentAmount = initialShipmentAmount ?? 0;
        calculatedInitialShipmentDistantAmount = 0;
        calculatedShipmentRefundAmount =
          shipmentRefundAmount + initialShipmentDistantAmount;
      }
      if (bundleShipmentType === ShipmentType.FREE) {
        calculatedInitialShipmentAmount = 0;
        calculatedInitialShipmentDistantAmount = 0;
        shipmentRefundAmount + initialShipmentDistantAmount;
      }
    }

    if (!isConditionalAmountBreak) {
      if (isFreeBreak) {
        if (bundleShipmentType === ShipmentType.CHARGE) {
          calculatedInitialShipmentAmount = initialShipmentAmount ?? 0;
          calculatedInitialShipmentDistantAmount = 0;
          calculatedShipmentRefundAmount =
            shipmentRefundAmount + initialShipmentDistantAmount;
        }
      }

      if (!isFreeBreak) {
        if (bundleShipmentType === ShipmentType.FREE) {
          calculatedInitialShipmentAmount = 0;
          calculatedInitialShipmentDistantAmount = 0;
          calculatedShipmentRefundAmount =
            shipmentRefundAmount + initialShipmentDistantAmount;
        }

        if (bundleShipmentType === ShipmentType.CHARGE) {
          calculatedInitialShipmentAmount = 0;
          calculatedInitialShipmentDistantAmount = 0;
          calculatedShipmentRefundAmount =
            shipmentRefundAmount + initialShipmentDistantAmount;
        }

        if (bundleShipmentType === ShipmentType.CONDITIONAL_FREE) {
          calculatedInitialShipmentAmount = 0;
          calculatedInitialShipmentDistantAmount = 0;
          calculatedShipmentRefundAmount =
            shipmentRefundAmount + initialShipmentDistantAmount;
        }
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
