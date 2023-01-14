import { v4 as uuidv4 } from "uuid";
import { OrdersType } from "@models/sale/order";

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

  const newOrderItems: Array<OrdersType> = [];
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

  orderItem.forEach((order, index) => {
    const previousOrder =
      index > 0 ? orderItem[index - 1].merchantUid : "firstIndex";
    const currentOrder = order.merchantUid;
    const nextOrder =
      index === orderItem.length - 1
        ? "overIndex"
        : orderItem[index + 1].merchantUid;

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
        const findFirstOrderIndex = orderItem.findIndex(
          ({ merchantUid, merchantItemUid }) =>
            merchantUid === firstOrder.merchantUid &&
            merchantItemUid === firstOrder.merchantItemUid
        );

        orderItem[findFirstOrderIndex].shipmentPrice =
          getFirstShipmentPrice(orders);
        orderItem[findFirstOrderIndex].shipmentDistantPrice =
          getFirstShipmentDistantPrice(orders);
      }

      const findNextOrderIndex = orderItem.findIndex(
        ({ merchantUid, merchantItemUid }) =>
          merchantUid === nextOrder.merchantUid &&
          merchantItemUid === nextOrder.merchantItemUid
      );
      orderItem[findNextOrderIndex].shipmentPrice = 0;
      orderItem[findNextOrderIndex].shipmentDistantPrice = 0;
    });
  });

  orderItem.forEach((order, index) => {
    const previousMerchantUid =
      index > 0 ? orderItem[index - 1].merchantUid : "firstIndex";
    const currentMerchantUid = order.merchantUid;

    const prevousIsBundleShipments =
      index > 0 ? orderItem[index - 1].isBundleShipment : "firstIndex";
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

  orderItem.forEach((order, index) => {
    const { product, options, merchantUid } = order;
    const eachOrderItemStyleIfno = {
      columnOrder: 0,
      isLastColumn: false,
    };

    const hasNewOrderItems = !!newOrderItems && !!newOrderItems.length;
    const hasOptions = !!options && !!options.length;

    if (hasOptions) {
      options.reduce((optionResult, option) => {
        eachOrderItemStyleIfno.columnOrder += 1;
        const hasOptions =
          !!option && !!option.components && !!option.components.length;
        if (!hasOptions) return;

        const previousMerchantUid = hasNewOrderItems
          ? newOrderItems[newOrderItems.length - 1].merchantUid
          : "";

        if (options.length === eachOrderItemStyleIfno.columnOrder) {
          eachOrderItemStyleIfno.isLastColumn = true;
        }

        if (newOrderItems.length !== 0 && merchantUid === previousMerchantUid) {
          newOrderItems[newOrderItems.length - 1].isLastColumn = false;
        }

        if (orderItem.length - 1 === index) {
          eachOrderItemStyleIfno.isLastColumn = false;
        }

        if (option.isRequired) {
          newOrderItems.push({
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

          newOrderItems.push({
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
      const previousMerchantUid = hasNewOrderItems
        ? newOrderItems[newOrderItems.length - 1].merchantUid
        : "";

      eachOrderItemStyleIfno.isLastColumn = true;

      if (newOrderItems.length !== 0 && merchantUid === previousMerchantUid) {
        newOrderItems[newOrderItems.length - 1].isLastColumn = false;
      }

      if (orderItem.length - 1 === index) {
        eachOrderItemStyleIfno.isLastColumn = false;
      }

      newOrderItems.push({
        ...order,
        rowIndex: uuidv4(),
        colorIndex: tableStyleInfo.rowColorIndexList[index],
        isLastColumn: eachOrderItemStyleIfno.isLastColumn,
      });
    }
  });

  return {
    orders: {
      allIds: newOrderItems.map((order) => order.rowIndex),
      byId: newOrderItems.reduce((byId, order) => {
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

export default constructOrderItem;
