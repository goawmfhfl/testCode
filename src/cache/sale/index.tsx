import { makeVar } from "@apollo/client";
import { ResetOrderItemType } from "@models/sale";

export const resetOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
