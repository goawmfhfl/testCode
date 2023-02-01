import { Cause, MainReason } from "@constants/sale";

const getCancelOrderItemComponents = (
  orderItemId: Array<number>,
  reason: {
    main: MainReason;
    detail: string;
    cause: Cause;
  }
) => {
  const componentsInitailValue: Array<{
    orderItemId: number;
    mainReason: MainReason;
    detailedReason: string;
    cause: Cause;
  }> = [];

  return orderItemId.reduce((result, orderItemId) => {
    const components = {
      orderItemId: orderItemId,
      mainReason: reason.main,
      detailedReason: reason.detail,
      cause: reason.cause,
    };

    result.push(components);

    return result;
  }, componentsInitailValue);
};

export default getCancelOrderItemComponents;
