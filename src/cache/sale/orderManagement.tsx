import { makeVar } from "@apollo/client";
import { OrderStatusType, OrderStatusGroup } from "@constants/sale";

import { FilterOptionVarType } from "@models/sale";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: null,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});
