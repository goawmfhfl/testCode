import { makeVar } from "@apollo/client";
import { SaleMenuStatusType } from "@constants/sale";
import { FilterOptionVarType } from "@models/sale/index";
import { ResetOrderItemType } from "@models/sale";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);

export const commonSaleFilterOptionVar = makeVar<FilterOptionVarType>({
  type: null,
  statusName: null,
  statusType: null,
  statusGroup: null,
});

export const commonCheckedOrderItemsVar = makeVar<Array<ResetOrderItemType>>(
  []
);
