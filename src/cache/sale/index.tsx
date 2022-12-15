import { makeVar } from "@apollo/client";
import { SaleMenuStatusType } from "@constants/sale";

export const checkedOrderIdsVar = makeVar<Array<number>>([]);
export const saleMenuStatusVar = makeVar<SaleMenuStatusType>(
  SaleMenuStatusType.CANCEL
);
