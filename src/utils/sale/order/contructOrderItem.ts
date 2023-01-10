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

const contructOrderItem = (orderItem: Array<OrdersType>) => {
  const hasOrderItems = !!orderItem && !!orderItem.length;
  if (!hasOrderItems) return;
  const newOrderItems: Array<OrdersType> = [];
  const colorBox = {
    index: 0,
  };

  orderItem.map((orderItem) => {
    const { id, product, options } = orderItem;
    const hasOptions = !!options && !!options.length;

    if (hasOptions) {
      options.reduce((optionResult, option) => {
        const hasOptions =
          !!option && !!option.components && !!option.components.length;

        if (!hasOptions) return;

        const findObject = newOrderItems.findIndex((item) => item.id === id);

        if (newOrderItems.length === 0) {
          colorBox.index = 0;
        }

        if (findObject === -1 && newOrderItems.length !== 0) {
          colorBox.index += 1;
        }

        if (colorBox.index >= 3) {
          colorBox.index = 0;
        }

        if (option.isRequired) {
          newOrderItems.push({
            ...orderItem,
            rowIndex: uuidv4(),
            options: [option],
            colorIndex: colorBox.index,
          });
        }

        if (!option.isRequired) {
          const resetProducts = reconstructRequiredProducts(
            product,
            option.components
          );
          const resetOption = reconstructRequiredOption(options);

          newOrderItems.push({
            ...orderItem,
            rowIndex: uuidv4(),
            originalPrice: null,
            discountAppliedPrice: null,
            product: resetProducts,
            options: resetOption,
            shipmentPrice: null,
            shipmentDistantPrice: null,
            colorIndex: colorBox.index,
          });
        }

        return optionResult;
      }, optionsInitialValue);
    }

    if (!hasOptions) {
      const findObject = newOrderItems.findIndex((item) => item.id === id);

      if (newOrderItems.length === 0) {
        colorBox.index = 0;
      }

      if (findObject === -1 && newOrderItems.length !== 0) {
        colorBox.index += 1;
      }

      if (colorBox.index >= 3) {
        colorBox.index = 0;
      }

      newOrderItems.push({
        ...orderItem,
        rowIndex: uuidv4(),
        colorIndex: colorBox.index,
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

const reconstructRequiredProducts = (
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

const reconstructRequiredOption = (
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

export default contructOrderItem;
