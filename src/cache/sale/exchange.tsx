import { makeVar } from "@apollo/client";

import { ResetOrderItemType } from "@models/sale";

export const exchangeOrderItemsVar = makeVar<Array<ResetOrderItemType>>([]);
