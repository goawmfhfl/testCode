import { MainReason, Cause } from "@constants/sale";

const getWhoseResponsibility = (reason: MainReason): Cause => {
  if (reason === MainReason.NO_INTENTION) return Cause.CLIENT;
  if (reason === MainReason.CHANGE_COLOR_OR_SIZE) return Cause.CLIENT;
  if (reason === MainReason.DIFFERENT_PRODUCT) return Cause.CLIENT;

  if (reason === MainReason.DELAYED_SHIPMENT) return Cause.SELLER;
  if (reason === MainReason.OMITTED_SHIPMENT) return Cause.SELLER;
  if (reason === MainReason.OUT_OF_STOCK) return Cause.SELLER;
  if (reason === MainReason.DAMAGED) return Cause.SELLER;
  if (reason === MainReason.MISINFORMED) return Cause.SELLER;
  if (reason === MainReason.MISDELIVERY) return Cause.SELLER;
};

export default getWhoseResponsibility;
