import { OrderStatusName } from "@constants/sale";

export const changeOrderStatusType = [
  {
    id: 0,
    label: "강제 상태 변경",
    value: OrderStatusName.DEFAULT,
  },
  {
    id: 1,
    label: "수거중으로 변경",
    value: OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS,
  },
  {
    id: 2,
    label: "수거완료로 변경",
    value: OrderStatusName.EXCHANGE_PICK_UP_COMPLETED,
  },
  {
    id: 3,
    label: "교환중으로 변경",
    value: OrderStatusName.SHIPPING_AGAIN,
  },
  {
    id: 4,
    label: "교환완료로 변경",
    value: OrderStatusName.EXCHANGE_COMPLETED,
  },
];
