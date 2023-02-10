import { makeVar } from "@apollo/client";
import { ResetOrderItemType } from "@models/sale";

export const refundOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
