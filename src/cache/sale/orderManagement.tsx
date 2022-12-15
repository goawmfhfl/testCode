import { makeVar } from "@apollo/client";
import { OrderStatusType } from "@models/sale";

import {
  OrderStatusGroup,
  FilterOptionVarType,
  OrderStatusName,
} from "@models/sale";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: null,
  statusName: OrderStatusName.PAYMENT_COMPLETED,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});
