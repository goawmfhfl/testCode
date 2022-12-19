import { OrderStatusName } from "@constants/sale";

export const getOrdersLength = (
  orders: Array<{
    orderStatus: { name: OrderStatusName };
  }>
) => {
  return orders.reduce(
    (result, { orderStatus: { name } }) => {
      if (name === OrderStatusName.CANCEL_REQUEST) result.cancelRequest++;
      if (name === OrderStatusName.CANCEL_COMPLETED) result.cancelCompleted++;

      return result;
    },
    {
      all: orders.length,
      cancelRequest: 0,
      cancelCompleted: 0,
    }
  );
};
