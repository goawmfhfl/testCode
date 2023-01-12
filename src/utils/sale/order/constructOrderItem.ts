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
  const tableRowStyleInfo = {
    rowIndex: 0,
  };

  orderItem.map((order, index) => {
    const { product, options, merchantItemUid, merchantUid, isBundleShipment } =
      order;
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
        const previousMerchantItemUid = hasNewOrderItems
          ? newOrderItems[newOrderItems.length - 1].merchantItemUid
          : "";
        const previousIsBundleShipment = hasNewOrderItems
          ? newOrderItems[newOrderItems.length - 1].isBundleShipment
          : "";

        if (newOrderItems.length === 0) {
          tableRowStyleInfo.rowIndex = 0;
        }

        if (newOrderItems.length !== 0 && merchantUid !== previousMerchantUid) {
          tableRowStyleInfo.rowIndex += 1;
        }

        if (
          newOrderItems.length !== 0 &&
          merchantUid === previousMerchantUid &&
          merchantItemUid !== previousMerchantItemUid &&
          previousIsBundleShipment !== isBundleShipment
        ) {
          tableRowStyleInfo.rowIndex += 1;
        }

        if (tableRowStyleInfo.rowIndex >= 3) {
          tableRowStyleInfo.rowIndex = 0;
        }

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
            colorIndex: tableRowStyleInfo.rowIndex,
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
            colorIndex: tableRowStyleInfo.rowIndex,
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
      const previousMerchantItemUid = hasNewOrderItems
        ? newOrderItems[newOrderItems.length - 1].merchantItemUid
        : "";
      const previousIsBundleShipment = hasNewOrderItems
        ? newOrderItems[newOrderItems.length - 1].isBundleShipment
        : "";

      if (newOrderItems.length === 0) {
        tableRowStyleInfo.rowIndex = 0;
      }

      if (newOrderItems.length !== 0 && merchantUid !== previousMerchantUid) {
        tableRowStyleInfo.rowIndex += 1;
      }

      if (
        newOrderItems.length !== 0 &&
        merchantUid === previousMerchantUid &&
        merchantItemUid !== previousMerchantItemUid &&
        previousIsBundleShipment !== isBundleShipment
      ) {
        tableRowStyleInfo.rowIndex += 1;
      }

      if (tableRowStyleInfo.rowIndex >= 3) {
        tableRowStyleInfo.rowIndex = 0;
      }

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
        colorIndex: tableRowStyleInfo.rowIndex,
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

export default constructOrderItem;
