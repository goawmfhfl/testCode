import { Cause, MainReason } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale";
import getWhoseResponsibility from "@utils/sale/cancel/getWhoseResponsibility";
import getMainReason from "@utils/sale/cancel/getMainReason";

const getConfirmOrDenyCancelComponents = (
  orderItems: Array<ResetOrderItemType>
) => {
  const orderItemsInitialValue: Array<{
    orderItemId: number;
    mainReason: MainReason;
    detailedReason: string;
    cause: Cause;
  }> = [];

  return orderItems.reduce((result, orderItem) => {
    const cause = getWhoseResponsibility(orderItem.mainReason);
    const mainReason = getMainReason(orderItem.mainReason);

    const components = {
      orderItemId: orderItem.id,
      mainReason,
      detailedReason: orderItem.detailedReason,
      cause,
    };

    result.push(components);

    return result;
  }, orderItemsInitialValue);
};

export default getConfirmOrDenyCancelComponents;
