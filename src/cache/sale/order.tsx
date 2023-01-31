import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType, OrderItems } from "@models/sale/index";
import { ResetOrderItemType } from "@models/sale";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});

export const orderItemsVar = makeVar<Array<OrderItems>>([]);
export const resetOrderItemVar = makeVar<Array<ResetOrderItemType>>([]);
