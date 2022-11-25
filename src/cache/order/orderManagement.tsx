import { makeVar } from "@apollo/client";

import {
  OrderStatusGroup,
  FilterOptionVarType,
} from "@models/order/orderManagement";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: null,
  statusName: null,
  statusType: null,
  statusGroup: OrderStatusGroup.ORDER,
});
