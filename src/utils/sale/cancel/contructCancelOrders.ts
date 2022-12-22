import { CancelOrdersType } from "@models/sale/cancel";
import { NormalizedType } from "@models/sale/cancel";

const contructCancelOrders = (orderItem: Array<CancelOrdersType>) => {
  const result: NormalizedType = {
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
export default contructCancelOrders;
