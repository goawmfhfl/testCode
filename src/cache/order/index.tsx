import { makeVar } from "@apollo/client";
import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusType,
  OrderStatusName,
  FilterOptionVarType,
} from "@models/order/orderManagement";

export const filterOptionVar = makeVar<FilterOptionVarType>({
  page: 1,
  skip: 20,
  query: "010",
  type: OrderSearchType.MERCHANT_UID,
  statusName: OrderStatusName.SHIPPING,
  statusType: OrderStatusType.CLAIM,
  statusGroup: OrderStatusGroup.CANCEL,
});
