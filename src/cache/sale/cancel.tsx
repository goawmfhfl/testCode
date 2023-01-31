import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType } from "@models/sale/cancel";
import { ResetCancelOrderItems } from "@models/sale/cancel";

export const checkedOrderItemsVar = makeVar<Array<ResetCancelOrderItems>>([]);
export const cancleOrderItemsVar = makeVar<Array<ResetCancelOrderItems>>([]);

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.CANCEL,
});
