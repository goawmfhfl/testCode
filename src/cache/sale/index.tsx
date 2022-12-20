import { makeVar } from "@apollo/client";
import { SaleMenuStatusType } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale/order";

export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.ORDER
);

export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const reasonVar = makeVar<{ detail: string; main: string }>({
  detail: "",
  main: "default",
});
