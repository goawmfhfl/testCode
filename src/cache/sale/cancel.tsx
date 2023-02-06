import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType } from "@models/sale/cancel";
import { ResetOrderItemType } from "@models/sale";

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const cancleOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.CANCEL,
});
