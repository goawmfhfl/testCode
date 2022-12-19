import { OrderStatusName } from "@constants/sale";

export const getOrdersLength = (
  orders: Array<{
    orderStatus: { name: OrderStatusName };
  }>
) => {
  return orders.reduce(
    (result, { orderStatus: { name } }) => {
      if (name === OrderStatusName.PAYMENT_COMPLETED) result.paymentCompleted++;
      if (name === OrderStatusName.PREPARING) result.preparing++;
      if (name === OrderStatusName.SHIPPING) result.shipping++;
      if (name === OrderStatusName.SHIPPING_COMPLETED)
        result.shippingCompleted++;

      return result;
    },
    {
      all: orders.length,
      paymentCompleted: 0,
      preparing: 0,
      shipping: 0,
      shippingCompleted: 0,
    }
  );
};
