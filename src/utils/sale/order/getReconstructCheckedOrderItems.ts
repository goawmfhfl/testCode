import { ResetOrderItemType } from "@models/sale/order";

const getReconstructCheckedOrderItems = (
  checkedOrderItems: Array<ResetOrderItemType>
) => {
  const checkedOrderItemsInitailValue: Array<ResetOrderItemType> = [];

  return checkedOrderItems.reduce((result, orderItem, index, array) => {
    const previousMerchantUid =
      index > 0 ? array[index - 1].merchantUid : "firstIndex";
    const currentMerchantUid = orderItem.merchantUid;

    const previousMerchantItemUid =
      index > 0 ? array[index - 1].merchantItemUid : "firstIndex";
    const currentMerchantItemUid = orderItem.merchantItemUid;

    const isPreviousAndCurrentMerchantUidBundle =
      previousMerchantUid === currentMerchantUid;
    const isPreviousAndCurrentMerchantItemUidBundle =
      previousMerchantItemUid === currentMerchantItemUid;

    if (
      !isPreviousAndCurrentMerchantUidBundle ||
      !isPreviousAndCurrentMerchantItemUidBundle
    ) {
      result.push(orderItem);
      return result;
    }

    return result;
  }, checkedOrderItemsInitailValue);
};
export default getReconstructCheckedOrderItems;
