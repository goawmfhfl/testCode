import { makeVar } from "@apollo/client";
import { OrderStatusType } from "@models/order/orderManagement";

import {
  OrderStatusGroup,
  FilterOptionVarType,
  OrderStatusName,
} from "@models/order/orderManagement";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: null,
  statusName: OrderStatusName.PAYMENT_COMPLETED,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});
