import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { OrdersType } from "@models/sale/order";

const contructOrderItem = (orderItem: Array<OrdersType>) => {
  const hasOrderItems = !!orderItem && !!orderItem.length;
  if (!hasOrderItems) return;

  const newOrderItems = cloneDeep(orderItem);

  const newOrderItemsInitialValue: Array<OrdersType> = [];
  const optionsInitialValue: Array<{
    components: {
      name: string;
      value: string;
    };
    price: number;
  }> = [];

  const colorBox = {
    index: 0,
  };

  const normalize = newOrderItems.reduce((orderItemResult, orderItem) => {
    const { id, product, options } = orderItem;

    options.reduce((optionResult, option) => {
      const hasOptions =
        !!option && !!option.components && !!option.components.length;

      const findObject = orderItemResult.findIndex((item) => item.id === id);

      if (orderItemResult.length === 0) {
        colorBox.index = 0;
      }

      if (findObject === -1 && orderItemResult.length !== 0) {
        colorBox.index += 1;
      }

      if (colorBox.index >= 3) {
        colorBox.index = 0;
      }

      if (hasOptions && option.isRequired) {
        orderItemResult.push({
          ...orderItem,
          rowIndex: uuidv4(),
          options: [option],
          colorIndex: colorBox.index,
        });
      }

      if (hasOptions && !option.isRequired) {
        const resetProducts = getProducts(product, option.components);

        orderItemResult.push({
          ...orderItem,
          rowIndex: uuidv4(),
          product: resetProducts,
          colorIndex: colorBox.index,
        });
      }

      return optionResult;
    }, optionsInitialValue);

    return orderItemResult;
  }, newOrderItemsInitialValue);

  return {
    orders: {
      allIds: normalize.map((order) => order.rowIndex),
      byId: normalize.reduce((byId, order) => {
        byId[order.rowIndex] = order;
        return byId;
      }, {}),
    },
  };
};

const getProducts = (
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
    return (result += `${name} : ${value}`);
  }, "");

  return {
    code: product.code,
    thumbnail: product.thumbnail,
    name: optionName,
  };
};

export default contructOrderItem;
