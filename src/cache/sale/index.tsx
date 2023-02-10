import { makeVar } from "@apollo/client";
import {
  OrderStatusType,
  OrderStatusGroup,
  OrderSearchType,
  SaleMenuStatusType,
} from "@constants/sale";
import { FilterOptionVarType, OrderItems } from "@models/sale/index";
import { ResetOrderItemType } from "@models/sale";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);

export const commonSaleFilterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: OrderStatusType.ORDER,
  statusGroup: OrderStatusGroup.ORDER,
});

export const commonCheckedOrderItemsVar = makeVar<Array<ResetOrderItemType>>(
  []
);
