import { makeVar } from "@apollo/client";
import { Cause, MainReason, SaleMenuStatusType } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale/order";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const reasonVar = makeVar<{
  detailedReason: string;
  mainReason: MainReason;
  cause: Cause;
}>({
  mainReason: MainReason.DEFAULT,
  detailedReason: "",
  cause: Cause.DEFAULT,
});
