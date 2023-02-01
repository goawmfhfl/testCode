import { MainReason, mainReasonType } from "@constants/sale";

const getMainReason = (mainReason: string) => {
  if (mainReason === mainReasonType.NO_INTENTION)
    return MainReason.NO_INTENTION;
  if (mainReason === mainReasonType.CHANGE_COLOR_OR_SIZE)
    return MainReason.CHANGE_COLOR_OR_SIZE;

  if (mainReason === mainReasonType.DIFFERENT_PRODUCT)
    return MainReason.DIFFERENT_PRODUCT;
  if (mainReason === mainReasonType.DELAYED_SHIPMENT)
    return MainReason.DELAYED_SHIPMENT;
  if (mainReason === mainReasonType.OMITTED_SHIPMENT)
    return MainReason.OMITTED_SHIPMENT;
  if (mainReason === mainReasonType.OUT_OF_STOCK)
    return MainReason.OUT_OF_STOCK;
  if (mainReason === mainReasonType.DAMAGED) return MainReason.DAMAGED;
  if (mainReason === mainReasonType.MISINFORMED) return MainReason.MISINFORMED;
  if (mainReason === mainReasonType.MISDELIVERY) return MainReason.MISDELIVERY;
};

export default getMainReason;
