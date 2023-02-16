import { Cause, MainReason } from "@constants/sale";

const getCancelOrderItemComponents = (
  orderItemId: Array<number>,
  reason: {
    main: MainReason;
    detail: string;
    cause: Cause;
  }
) => {
  return orderItemId.map((id) => ({
    orderItemId: id,
    mainReason: reason.main,
    detailedReason: reason.detail,
    cause: reason.cause,
  }));
};

export default getCancelOrderItemComponents;
