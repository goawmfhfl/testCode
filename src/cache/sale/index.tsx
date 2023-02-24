import { makeVar } from "@apollo/client";
import { OrderStatusGroup } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale";

export const resetOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const checkedOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
export const orderStatusGroupVar = makeVar<Array<OrderStatusGroup>>([]);
