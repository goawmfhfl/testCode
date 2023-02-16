import { OrderStatusName } from "@constants/sale";

export const changeRefundOrderStatusByForceType = [
  {
    id: 0,
    label: "강제 상태 변경",
    value: OrderStatusName.DEFAULT,
  },
  {
    id: 1,
    label: "수거중으로 변경",
    value: OrderStatusName.REFUND_PICK_UP_IN_PROGRESS,
  },
  {
    id: 2,
    label: "수거완료로 변경",
    value: OrderStatusName.REFUND_PICK_UP_COMPLETED,
  },
];
