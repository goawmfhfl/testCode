import { Cause, mainReasonType } from "@constants/sale";

const getWhoseResponsibility = (mainReason: string) => {
  if (mainReason === mainReasonType.NO_INTENTION) return;
  if (mainReason === mainReasonType.CHANGE_COLOR_OR_SIZE) return Cause.CLIENT;
  if (mainReason === mainReasonType.DIFFERENT_PRODUCT) return Cause.CLIENT;
  if (mainReason === mainReasonType.DELAYED_SHIPMENT) return Cause.SELLER;
  if (mainReason === mainReasonType.OMITTED_SHIPMENT) return Cause.SELLER;
  if (mainReason === mainReasonType.OUT_OF_STOCK) return Cause.SELLER;
  if (mainReason === mainReasonType.DAMAGED) return Cause.SELLER;
  if (mainReason === mainReasonType.MISINFORMED) return Cause.SELLER;
  if (mainReason === mainReasonType.MISDELIVERY) return Cause.SELLER;
  if (mainReason === mainReasonType.CUSTOM_MADE) return Cause.CLIENT;
};

export default getWhoseResponsibility;
