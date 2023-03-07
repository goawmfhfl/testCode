import { ShipmentType } from "@constants/sale";
import { TC1, NewOrderItems } from "./calculateShipmentPrice_ts";

const calculateShipmentPrice = () => {
  const newBundleOrderItems: Array<Array<NewOrderItems>> = TC1;

  newBundleOrderItems.forEach((eachBundleOrderItems) => {
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
};

const getShipmentPrice = (orders: Array<NewOrderItems>) => {
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

const getShipmentDistantPrice = (orders: Array<NewOrderItems>) => {
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

export default calculateShipmentPrice;
