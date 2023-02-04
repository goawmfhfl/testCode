import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType, ResetOrderItemType } from "@models/sale";

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const refundOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: null,
  statusGroup: OrderStatusGroup.REFUND,
});
