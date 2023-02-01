import { ResetOrderItemType } from "@models/sale";

const getOrderItemIsCheckedStatus = (orderItems: Array<ResetOrderItemType>) => {
  return orderItems.reduce(
    (result, { claimStatus }) => {
      if (claimStatus === "-") result.isCancelCompletedChecked = false;
      if (claimStatus === "취소 완료") result.isCancelCompletedChecked = true;
      return result;
    },
    {
      isCancelCompletedChecked: false,
    }
  );
};

export default getOrderItemIsCheckedStatus;
