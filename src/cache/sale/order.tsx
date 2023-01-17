import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
} from "@constants/sale";
import { FilterOptionVarType } from "@models/sale";
import { OrdersType, ResetOrderItemType } from "@models/sale/order";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});

export const orderItemsVar = makeVar<Array<OrdersType>>([]);
export const resetOrderItemVar = makeVar<Array<ResetOrderItemType>>([]);
