import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType } from "@models/sale";
import { ResetCancelOrders } from "@models/sale/cancel";

export const checkedOrdersVar = makeVar<Array<ResetCancelOrders>>([]);

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.CANCEL,
});
