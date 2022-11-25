import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";
import { NormalizedListType } from "@models/order/orderManagement";

const contructOrderItem = (orderItem: Array<OrderItemsType>) => {
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
