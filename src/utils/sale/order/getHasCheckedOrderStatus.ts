import { ResetOrderItemType } from "@models/sale/order";

export const getHasCheckedOrderStatus = (
  checkedOrderItems: Array<ResetOrderItemType>
) => {
  const {
    isPaymentCompletedChecked,
    isPreparingChecked,
    isShippingChecked,
    isShippingCompletedChecked,
    isCancelRequestChecked,
  } = checkedOrderItems.reduce(
    (result, { orderStatus, claimStatus }) => {
      if (orderStatus === "새주문") result.isPaymentCompletedChecked = true;
      if (orderStatus === "상품준비중") result.isPreparingChecked = true;
      if (orderStatus === "배송중") result.isShippingChecked = true;
      if (orderStatus === "배송완료") result.isShippingCompletedChecked = true;
      if (claimStatus === "취소요청") result.isCancelRequestChecked = true;

      return result;
    },
    {
      isPaymentCompletedChecked: false,
      isPreparingChecked: false,
      isShippingChecked: false,
      isShippingCompletedChecked: false,
      isCancelRequestChecked: false,
    }
  );

  return {
    isPaymentCompletedChecked,
    isPreparingChecked,
    isShippingChecked,
    isShippingCompletedChecked,
    isCancelRequestChecked,
  };
};
