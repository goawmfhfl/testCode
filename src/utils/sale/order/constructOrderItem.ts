import { v4 as uuidv4 } from "uuid";
import { OrdersType } from "@models/sale/order";
import { cloneDeep } from "lodash";

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

const constructOrderItem = (orderItem: Array<OrdersType>) => {
  const hasOrderItems = !!orderItem && !!orderItem.length;
  if (!hasOrderItems) return;

  const newOrderItems: Array<OrdersType> = cloneDeep(orderItem).sort(
    compareBundleShipment
  );
  const reconstructOrderItems: Array<OrdersType> = [];

  const bundleOrder: {
    bundleOrders: Array<Array<OrdersType>>;
    temporaryBundleOrders: Array<OrdersType>;
  } = {
    bundleOrders: [],
    temporaryBundleOrders: [],
  };
  const tableStyleInfo: {
    colorIndex: number;
    rowColorIndexList: Array<number>;
  } = {
    colorIndex: 0,
    rowColorIndexList: [],
  };

  newOrderItems.forEach((order, index) => {
    const previousOrder =
      index > 0 ? newOrderItems[index - 1].merchantUid : "firstIndex";
    const currentOrder = order.merchantUid;
    const nextOrder =
      index === newOrderItems.length - 1
        ? "overIndex"
        : newOrderItems[index + 1].merchantUid;

    if (nextOrder === "overIndex") {
      if (previousOrder === currentOrder) {
        bundleOrder.temporaryBundleOrders.push(order);
      }

      if (bundleOrder.temporaryBundleOrders.length > 1) {
        bundleOrder.bundleOrders.push(bundleOrder.temporaryBundleOrders);
        bundleOrder.temporaryBundleOrders = [];
      }

      return;
    }

    if (previousOrder === currentOrder) {
      bundleOrder.temporaryBundleOrders.push(order);

      return;
    }

    if (
      previousOrder !== currentOrder &&
      currentOrder === nextOrder &&
      bundleOrder.temporaryBundleOrders.length !== 0
    ) {
      bundleOrder.bundleOrders.push(bundleOrder.temporaryBundleOrders);
      bundleOrder.temporaryBundleOrders = [];
      bundleOrder.temporaryBundleOrders.push(order);

      return;
    }

    if (currentOrder === nextOrder) {
      bundleOrder.temporaryBundleOrders.push(order);

      return;
    }

    if (
      previousOrder !== currentOrder &&
      bundleOrder.temporaryBundleOrders.length !== 0
    ) {
      bundleOrder.bundleOrders.push(bundleOrder.temporaryBundleOrders);
      bundleOrder.temporaryBundleOrders = [];

      if (currentOrder === nextOrder) {
        bundleOrder.temporaryBundleOrders.push(order);
      }
    }
  });

  bundleOrder.bundleOrders.forEach((orders) => {
    orders.forEach((_, index) => {
      const firstOrder = orders[0];
      const nextOrder =
        index === orders.length - 1 ? "overIndex" : orders[index + 1];

      if (nextOrder === "overIndex") return;

      if (index === 0) {
        const findFirstOrderIndex = newOrderItems.findIndex(
          ({ merchantUid, merchantItemUid }) =>
            merchantUid === firstOrder.merchantUid &&
            merchantItemUid === firstOrder.merchantItemUid
        );

        newOrderItems[findFirstOrderIndex].shipmentPrice =
          getFirstShipmentPrice(orders);
        newOrderItems[findFirstOrderIndex].shipmentDistantPrice =
          getFirstShipmentDistantPrice(orders);
      }

      const findNextOrderIndex = newOrderItems.findIndex(
        ({ merchantUid, merchantItemUid }) =>
          merchantUid === nextOrder.merchantUid &&
          merchantItemUid === nextOrder.merchantItemUid
      );
      newOrderItems[findNextOrderIndex].shipmentPrice = 0;
      newOrderItems[findNextOrderIndex].shipmentDistantPrice = 0;
    });
  });

  newOrderItems.forEach((order, index) => {
    const previousMerchantUid =
      index > 0 ? newOrderItems[index - 1].merchantUid : "firstIndex";
    const currentMerchantUid = order.merchantUid;

    const prevousIsBundleShipments =
      index > 0 ? newOrderItems[index - 1].isBundleShipment : "firstIndex";
    const currentIsBundleShipments = order.isBundleShipment;

    if (
      previousMerchantUid === "firstIndex" &&
      prevousIsBundleShipments === "firstIndex"
    ) {
      tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
      return;
    }
    if (previousMerchantUid !== currentMerchantUid) {
      if (tableStyleInfo.colorIndex === 2) {
        tableStyleInfo.colorIndex = 0;
        tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
        return;
      }

      if (tableStyleInfo.colorIndex !== 2) {
        tableStyleInfo.colorIndex += 1;
        tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
        return;
      }
    }

    if (previousMerchantUid === currentMerchantUid) {
      if (
        prevousIsBundleShipments === true &&
        currentIsBundleShipments === true
      ) {
        tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
        return;
      } else {
        if (tableStyleInfo.colorIndex === 2) {
          tableStyleInfo.colorIndex = 0;
          tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
          return;
        }

        if (tableStyleInfo.colorIndex !== 2) {
          tableStyleInfo.colorIndex += 1;
          tableStyleInfo.rowColorIndexList.push(tableStyleInfo.colorIndex);
          return;
        }
      }
    }
  });

  newOrderItems.forEach((order, index) => {
    const { product, options, merchantUid } = order;
    const eachOrderItemStyleIfno = {
      columnOrder: 0,
      isLastColumn: false,
    };

    const hasReconstructOrderItems =
      !!reconstructOrderItems && !!reconstructOrderItems.length;
    const hasOptions = !!options && !!options.length;

    if (hasOptions) {
      options.reduce((optionResult, option) => {
        eachOrderItemStyleIfno.columnOrder += 1;
        const hasOptions =
          !!option && !!option.components && !!option.components.length;
        if (!hasOptions) return;

        const previousMerchantUid = hasReconstructOrderItems
          ? reconstructOrderItems[reconstructOrderItems.length - 1].merchantUid
          : "";

        if (options.length === eachOrderItemStyleIfno.columnOrder) {
          eachOrderItemStyleIfno.isLastColumn = true;
        }

        if (
          reconstructOrderItems.length !== 0 &&
          merchantUid === previousMerchantUid
        ) {
          reconstructOrderItems[reconstructOrderItems.length - 1].isLastColumn =
            false;
        }

        if (newOrderItems.length - 1 === index) {
          eachOrderItemStyleIfno.isLastColumn = false;
        }

        if (option.isRequired) {
          reconstructOrderItems.push({
            ...order,
            rowIndex: uuidv4(),
            options: [option],
            colorIndex: tableStyleInfo.rowColorIndexList[index],
            isLastColumn: eachOrderItemStyleIfno.isLastColumn,
          });
        }
        if (!option.isRequired) {
          const resetProducts = reconstructNotRequiredProducts(
            product,
            option.components
          );
          const resetOption = reconstructNotRequiredOption(options);

          reconstructOrderItems.push({
            ...order,
            rowIndex: uuidv4(),
            originalPrice: null,
            discountAppliedPrice: null,
            product: resetProducts,
            options: resetOption,
            shipmentPrice: null,
            shipmentDistantPrice: null,
            colorIndex: tableStyleInfo.rowColorIndexList[index],
            isLastColumn: eachOrderItemStyleIfno.isLastColumn,
          });
        }

        return optionResult;
      }, optionsInitialValue);
    }
    if (!hasOptions) {
      const previousMerchantUid = hasReconstructOrderItems
        ? reconstructOrderItems[reconstructOrderItems.length - 1].merchantUid
        : "";

      eachOrderItemStyleIfno.isLastColumn = true;

      if (
        reconstructOrderItems.length !== 0 &&
        merchantUid === previousMerchantUid
      ) {
        reconstructOrderItems[reconstructOrderItems.length - 1].isLastColumn =
          false;
      }

      if (newOrderItems.length - 1 === index) {
        eachOrderItemStyleIfno.isLastColumn = false;
      }

      reconstructOrderItems.push({
        ...order,
        rowIndex: uuidv4(),
        colorIndex: tableStyleInfo.rowColorIndexList[index],
        isLastColumn: eachOrderItemStyleIfno.isLastColumn,
      });
    }
  });

  return {
    orders: {
      allIds: reconstructOrderItems.map((order) => order.rowIndex),
      byId: reconstructOrderItems.reduce((byId, order) => {
        byId[order.rowIndex] = order;
        return byId;
      }, {}),
    },
  };
};

const reconstructNotRequiredProducts = (
  product: {
    code: string;
    thumbnail: string;
    name: string;
  },
  components: Array<{
    name: string;
    value: string;
  }>
) => {
  const optionName = components.reduce((result, { name, value }) => {
    if (result) {
      result += `/ ${name} : ${value} `;
    }
    if (!result) {
      result = `${name} : ${value} `;
    }

    return result;
  }, "");

  return {
    code: product.code,
    thumbnail: product.thumbnail,
    name: optionName,
  };
};

const reconstructNotRequiredOption = (
  option: Array<{
    id: number;
    components: Array<{
      name: string;
      value: string;
    }>;
    quantity: number;
    price: number;
    isRequired: boolean;
  }>
) => {
  return option.reduce((result, { id, quantity, price, isRequired }) => {
    result.push({
      id: id,
      components: null,
      quantity,
      price,
      isRequired,
    });

    return result;
  }, optionsInitialValue);
};

const getFirstShipmentPrice = (orders: Array<OrdersType>) => {
  return orders.reduce((result, { shipmentPrice }) => {
    return (result = Math.max(result, shipmentPrice));
  }, 0);
};

const getFirstShipmentDistantPrice = (orders: Array<OrdersType>) => {
  return orders.reduce((result, { shipmentDistantPrice }) => {
    if (shipmentDistantPrice) return (result = shipmentDistantPrice);
    if (!shipmentDistantPrice) return (result = 0);
  }, 0);
};
const compareBundleShipment = (a: OrdersType, b: OrdersType) => {
  if (a.merchantUid !== b.merchantUid) return 0;
  if (a.isBundleShipment && !b.isBundleShipment) return -1;
  if (!a.isBundleShipment && b.isBundleShipment) return 1;
  return 0;
};

export default constructOrderItem;
