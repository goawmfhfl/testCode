import { makeVar } from "@apollo/client";
import {
  OrderSearchType,
  OrderStatusGroup,
  SaleMenuStatusType,
} from "@constants/sale";
import { FilterOptionVarType, OrderItems } from "@models/sale/index";
import { ResetOrderItemType } from "@models/sale";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);

export const totalOrderItemsVar = makeVar<Array<OrderItems>>([]);

export const commonSaleFilterOptionVar = makeVar<FilterOptionVarType>({
  type: OrderSearchType.RECIPIENT_NAME,
  statusName: null,
  statusType: null,
  statusGroup: OrderStatusGroup.ORDER,
});

export const commonCheckedOrderItemsVar = makeVar<Array<ResetOrderItemType>>(
  []
);
