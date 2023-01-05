import { Cause, MainReason } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale/order";

const getCancelOrderItemsInput = (
  checkedOrderItems: Array<ResetOrderItemType>,
  mainReason: MainReason,
  detailedReason: string,
  cause: Cause
) => {
  return checkedOrderItems.map(({ totalPrice, id }) => ({
    orderItemId: id,
    amount: Number(totalPrice.replace(",", "")),
    mainReason,
    detailedReason,
    cause,
  }));
};

export default getCancelOrderItemsInput;
