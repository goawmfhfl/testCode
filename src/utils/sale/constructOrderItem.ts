import { v4 as uuidv4 } from "uuid";
import { OrderItems } from "@models/sale/index";
import { cloneDeep } from "lodash";
import { ShipmentType } from "@constants/sale";

const optionsInitialValue: Array<{
  id: number;
  components: Array<{
    name: string;
    value: string;
  }>;
  quantity: number;
  price: number;
  isRequired: boolean;
}> = [];

const constructOrderItem = (orderItem: Array<OrderItems>) => {
  const hasOrderItems = !!orderItem && !!orderItem.length;
  if (!hasOrderItems) return;

  const newOrderItems: Array<OrderItems> = cloneDeep(orderItem).sort(
    compareBundleShipment
  );
  const reconstructOrderItems: Array<OrderItems> = [];

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

  tableLayoutCalculator.bundleOrderItems.forEach((eachBundleOrderItems) => {
    // const hasBundleOrders = !!bundleOrders && !!bundleOrders.length;
    // if (!hasBundleOrders) return;

    eachBundleOrderItems.forEach((orderItem, index, array) => {
      const findCurrentOrderIndex = newOrderItems.findIndex(
        ({ merchantUid, merchantItemUid }) =>
          merchantUid === orderItem.merchantUid &&
          merchantItemUid === orderItem.merchantItemUid
      );

      if (index === 0) {
        newOrderItems[findCurrentOrderIndex].shipmentPrice =
          getShipmentPrice(array);
        newOrderItems[findCurrentOrderIndex].shipmentDistantPrice =
          getShipmentDistantPrice(array);
        return;
      }

      if (index > 0) {
        newOrderItems[findCurrentOrderIndex].shipmentPrice = 0;
        newOrderItems[findCurrentOrderIndex].shipmentDistantPrice = 0;
      }
    });
  });

  newOrderItems.forEach((orderItem, index, array) => {
    const { thumbnail, options, merchantUid } = orderItem;
    const tableLayoutCalculator = {
      rowOrders: 0,
      isLastRow: false,
      isFirstRow: false,
    };

    const hasReconstructOrderItems =
      !!reconstructOrderItems && !!reconstructOrderItems.length;
    const hasOptions = !!options && !!options.length;

    if (hasOptions) {
      options.reduce((optionResult, option) => {
        const hasOptions =
          !!option && !!option.components && !!option.components.length;
        if (!hasOptions) return;

        tableLayoutCalculator.rowOrders += 1;

        const previousMerchantUid = hasReconstructOrderItems
          ? reconstructOrderItems[reconstructOrderItems.length - 1].merchantUid
          : "";

        if (options.length === tableLayoutCalculator.rowOrders) {
          tableLayoutCalculator.isLastRow = true;
        }

        if (
          reconstructOrderItems.length !== 0 &&
          merchantUid === previousMerchantUid
        ) {
          reconstructOrderItems[reconstructOrderItems.length - 1].isLastRow =
            false;
        }

        if (array.length - 1 === index) {
          tableLayoutCalculator.isLastRow = false;
        }

        if (tableLayoutCalculator.rowOrders === 1) {
          tableLayoutCalculator.isFirstRow = true;
        }

        if (tableLayoutCalculator.rowOrders !== 1) {
          tableLayoutCalculator.isFirstRow = false;
        }

        if (option.isRequired) {
          reconstructOrderItems.push({
            ...orderItem,
            rowIndex: uuidv4(),
            options: [option],
            isLastRow: tableLayoutCalculator.isLastRow,
            isFirstRow: tableLayoutCalculator.isFirstRow,
          });
        }
        if (!option.isRequired) {
          const optionName = reconstructNotRequiredProducts(option.components);
          const resetOption = reconstructNotRequiredOption(option);

          reconstructOrderItems.push({
            ...orderItem,
            rowIndex: uuidv4(),
            originalPrice: null,
            discountAppliedPrice: null,
            thumbnail,
            name: optionName,
            options: [resetOption],
            shipmentPrice: null,
            shipmentDistantPrice: null,
            isLastRow: tableLayoutCalculator.isLastRow,
            isFirstRow: tableLayoutCalculator.isFirstRow,
          });
        }

        return optionResult;
      }, optionsInitialValue);
    }
    if (!hasOptions) {
      const previousMerchantUid = hasReconstructOrderItems
        ? reconstructOrderItems[reconstructOrderItems.length - 1].merchantUid
        : "";

      tableLayoutCalculator.isLastRow = true;
      tableLayoutCalculator.isFirstRow = true;

      if (
        reconstructOrderItems.length !== 0 &&
        merchantUid === previousMerchantUid
      ) {
        reconstructOrderItems[reconstructOrderItems.length - 1].isLastRow =
          false;
      }

      if (array.length - 1 === index) {
        tableLayoutCalculator.isLastRow = false;
      }

      reconstructOrderItems.push({
        ...orderItem,
        rowIndex: uuidv4(),
        isLastRow: tableLayoutCalculator.isLastRow,
        isFirstRow: tableLayoutCalculator.isFirstRow,
      });
    }
  });

  return {
    orderItems: {
      allIds: reconstructOrderItems.map((order) => order.rowIndex),
      byId: reconstructOrderItems.reduce((byId, order) => {
        byId[order.rowIndex] = order;
        return byId;
      }, {}),
    },
  };
};

const reconstructNotRequiredProducts = (
  components: Array<{
    name: string;
    value: string;
  }>
): string => {
  const optionName = components.reduce((result, { name, value }) => {
    if (result) {
      result += `/ ${name} : ${value} `;
    }
    if (!result) {
      result = `${name} : ${value} `;
    }

    return result;
  }, "");

  return optionName;
};

const reconstructNotRequiredOption = (option: {
  id: number;
  components: Array<{
    name: string;
    value: string;
  }>;
  quantity: number;
  price: number;
  isRequired: boolean;
}) => {
  const { id, quantity, price, isRequired } = option;

  return {
    id,
    components: null,
    quantity,
    price,
    isRequired,
  };
};

const getShipmentPrice = (orders: Array<OrderItems>) => {
  return orders.reduce(
    (
      result,
      {
        orderByShop: {
          bundleShipmentPrice,
          bundleShipmentType,
          bundleOrderItemTotalPrice,
          shipmentConditionalPrice,
        },
      }
    ) => {
      let shipmentPrice = 0;

      if (bundleShipmentType === ShipmentType.FREE) {
        shipmentPrice = 0;
      }

      if (bundleShipmentType === ShipmentType.CHARGE) {
        shipmentPrice = bundleShipmentPrice;
      }

      if (bundleShipmentType === ShipmentType.CONDITIONAL_FREE) {
        const isConditionalFree =
          bundleOrderItemTotalPrice > shipmentConditionalPrice;

        shipmentPrice = isConditionalFree ? 0 : bundleShipmentPrice;
      }

      return (result = Math.max(result, shipmentPrice));
    },
    0
  );
};

const getShipmentDistantPrice = (orders: Array<OrderItems>) => {
  return orders.reduce(
    (result, { orderByShop: { bundleShipmentDistantPrice } }) => {
      if (bundleShipmentDistantPrice) {
        return (result = bundleShipmentDistantPrice);
      }

      if (!bundleShipmentDistantPrice) {
        return (result = 0);
      }
    },
    0
  );
};

const compareBundleShipment = (a: OrderItems, b: OrderItems) => {
  if (a.merchantUid !== b.merchantUid) return 0;
  if (a.isBundleShipment && !b.isBundleShipment) return -1;
  if (!a.isBundleShipment && b.isBundleShipment) return 1;
  return 0;
};

export default constructOrderItem;
