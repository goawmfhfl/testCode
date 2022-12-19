import { makeVar } from "@apollo/client";
import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusType,
  SaleMenuStatusType,
} from "@constants/sale";
import { FilterOptionVarType, ResetOrderItemType } from "@models/sale";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const reasonVar = makeVar<string>("test Reason");

export const filterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});
