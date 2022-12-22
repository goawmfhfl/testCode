import { ResetCancelOrders } from "@models/sale/cancel";

const getHasCheckedOrderStatus = (checkedOrders: Array<ResetCancelOrders>) => {
  if (checkedOrders.length === 0)
    return {
      isCancelRequestChecked: false,
      isCancelCompletedChecked: false,
    };

  return checkedOrders.reduce(
    (result, { orderStatus }) => {
      if (orderStatus === "취소요청") result.isCancelRequestChecked = true;
      if (orderStatus === "취소완료") result.isCancelCompletedChecked = true;
      return result;
    },
    {
      isCancelRequestChecked: false,
      isCancelCompletedChecked: false,
    }
  );
};

export default getHasCheckedOrderStatus;
