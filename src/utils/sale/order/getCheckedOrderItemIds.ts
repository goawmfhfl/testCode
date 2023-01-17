import { ResetOrderItemType } from "@models/sale/order";

const getCheckedOrderItemIds = (orderItems: Array<ResetOrderItemType>) => {
  const checkedOrderItemIdsInitalValue: Array<number> = [];

  return orderItems.reduce((result, order, index, array) => {
    const previousArrayId = index > 0 ? array[index - 1].id : "firstIndex";
    const currentArrayId = order.id;

    if (
      previousArrayId !== "firstIndex" &&
      previousArrayId === currentArrayId
    ) {
      return result;
    }

    if (previousArrayId !== currentArrayId) {
      result.push(order.id);

      return result;
    }
  }, checkedOrderItemIdsInitalValue);
};

export default getCheckedOrderItemIds;
