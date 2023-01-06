import { OrdersType } from "@models/sale/order";
import { NormalizedListType } from "@models/sale/order";

const contructOrderItem = (orderItem: Array<OrdersType>) => {
  const hasOrderItems = !!orderItem && !!orderItem.length;
  if (!hasOrderItems) return;

  const result: NormalizedListType = {
    orders: {
      allIds: orderItem.map((order) => order.id),
      byId: orderItem.reduce((byId, order) => {
        byId[order.id] = order;
        return byId;
      }, {}),
    },
  };

  return result;
};
export default contructOrderItem;
