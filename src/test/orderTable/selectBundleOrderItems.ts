import { TC1, TC2 } from "./selectBundleOrderItems_ts";

interface OrderItems {
  merchantUid: string;
  colorIndex: number;
  isBundleShipment: boolean;
}

const selectBundleOrderItems = () => {
  const newOrderItems: Array<OrderItems> = TC2.sort(compareBundleShipment);

  const tableLayoutCalculator: {
    colorIndex: number;
    bundleOrderItems: Array<Array<OrderItems>>;
    temporaryBundleOrderItems: Array<OrderItems>;
  } = {
    colorIndex: 0,
    bundleOrderItems: [],
    temporaryBundleOrderItems: [],
  };

  newOrderItems.forEach((orderItem, index, array) => {
    const previousOrderItem = 0 < index ? array[index - 1].merchantUid : null;
    const currentOrderItem = orderItem.merchantUid;
    const nextOrderItem =
      index === array.length - 1 ? null : array[index + 1].merchantUid;

    const previousIsBundleShipment =
      0 < index ? array[index - 1].isBundleShipment : null;
    const currentIsBundleShipment = orderItem.isBundleShipment;
    const nextIsBundleShipment =
      index === array.length - 1 ? null : array[index + 1].isBundleShipment;

    const isPreviousAndCurrentShipmentTypeNotSame =
      previousIsBundleShipment !== currentIsBundleShipment;
    const isPreviousAndCurrentOrderItemBundle =
      previousOrderItem === currentOrderItem;
    const isCurrentAndNextOrderItemBundle = currentOrderItem === nextOrderItem;

    if (index === 0) {
      newOrderItems[index].colorIndex = 0;
      if (
        isCurrentAndNextOrderItemBundle &&
        currentIsBundleShipment &&
        nextIsBundleShipment
      ) {
        tableLayoutCalculator.temporaryBundleOrderItems.push(orderItem);
        return;
      }
      return;
    }

    if (isPreviousAndCurrentOrderItemBundle) {
      if (currentIsBundleShipment && previousIsBundleShipment) {
        tableLayoutCalculator.temporaryBundleOrderItems.push(orderItem);
      }

      if (!isCurrentAndNextOrderItemBundle) {
        if (tableLayoutCalculator.temporaryBundleOrderItems.length > 1) {
          tableLayoutCalculator.bundleOrderItems.push(
            tableLayoutCalculator.temporaryBundleOrderItems
          );
          tableLayoutCalculator.temporaryBundleOrderItems = [];
        }
      }

      newOrderItems[index].colorIndex = tableLayoutCalculator.colorIndex;

      if (isPreviousAndCurrentShipmentTypeNotSame) {
        if (tableLayoutCalculator.colorIndex !== 2) {
          tableLayoutCalculator.colorIndex += 1;
          newOrderItems[index].colorIndex = tableLayoutCalculator.colorIndex;
          return;
        }

        if (tableLayoutCalculator.colorIndex === 2) {
          newOrderItems[index].colorIndex = 0;
          tableLayoutCalculator.colorIndex = 0;
          return;
        }
      }
    }

    if (!isPreviousAndCurrentOrderItemBundle) {
      if (
        isCurrentAndNextOrderItemBundle &&
        currentIsBundleShipment &&
        nextIsBundleShipment
      ) {
        tableLayoutCalculator.temporaryBundleOrderItems.push(orderItem);
      }

      if (tableLayoutCalculator.colorIndex !== 2) {
        tableLayoutCalculator.colorIndex += 1;
        newOrderItems[index].colorIndex = tableLayoutCalculator.colorIndex;
        return;
      }

      if (tableLayoutCalculator.colorIndex === 2) {
        newOrderItems[index].colorIndex = 0;
        tableLayoutCalculator.colorIndex = 0;
        return;
      }
    }
  });

  return tableLayoutCalculator;
};

const compareBundleShipment = (a: OrderItems, b: OrderItems) => {
  if (a.merchantUid !== b.merchantUid) return 0;
  if (a.isBundleShipment && !b.isBundleShipment) return -1;
  if (!a.isBundleShipment && b.isBundleShipment) return 1;
  return 0;
};
export default selectBundleOrderItems;
