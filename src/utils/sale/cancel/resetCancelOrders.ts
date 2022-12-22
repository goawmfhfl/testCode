import { orderStatusNameType } from "@constants/sale";
import { NormalizedType } from "@models/sale/cancel";
import getStatusReasonState from "@utils/sale/cancel/getStatusReasonState";

const resetCancelOrders = (recontructCancelOrders: NormalizedType) => {
  if (
    !recontructCancelOrders ||
    !recontructCancelOrders.orders ||
    !recontructCancelOrders.orders.allIds ||
    !recontructCancelOrders.orders.byId
  )
    return;

  const cancelOrderAllIds = recontructCancelOrders.orders.allIds;
  const cancelOrderById = recontructCancelOrders.orders.byId;

  const result = cancelOrderAllIds.map((id) => {
    const {
      merchantItemUid,
      product,
      user,
      orderByShop,
      options,
      quantity,
      discountAppliedPrice,
      originalPrice,
      shipmentPrice,
      shipmentDistantPrice,
      statusReasons,
      orderStatus,
      claimStatus,
    } = cancelOrderById[id];

    const resetMerchantItemUid = merchantItemUid ? merchantItemUid : "-";
    const resetProductCode = product?.code ? product.code : "-";
    const resetOrderProduct = product?.name ? product.name : "-";
    const resetUserName = user?.name ? user.name : "-";

    const {
      mainReason,
      detaildReason,
      refusalMainReason,
      refusalDetaildReason,
      cancelRequestDay,
      cancelRefusalDay,
      cancelCompletedDay,
      totalRefundPrice,
    } = getStatusReasonState(statusReasons);

    const resetOrderStatus = orderStatus?.name
      ? orderStatusNameType[orderStatus.name]
      : "-";

    const resetClaimStatus = claimStatus?.name ? claimStatus.name : "-";
    const resetPayments = user?.payments?.createdAt
      ? user.payments.createdAt
      : "-";
    const resetRecipientName = orderByShop?.order?.recipientName
      ? orderByShop.order.recipientName
      : "-";
    const resetRecipientPhoneNumber = orderByShop?.order?.recipientPhoneNumber
      ? orderByShop.order.recipientPhoneNumber
      : "-";
    const resetUserEmail = user?.email ? user.email : "-";
    const resetUserPhoneNumber = user?.phoneNumber ? user.phoneNumber : "-";
    const resetOption = "-";
    const resetQuantity = quantity ? quantity : 0;
    const resetPrice = discountAppliedPrice
      ? discountAppliedPrice
      : originalPrice
      ? originalPrice
      : 0;

    const resetOptionPrice = "-";
    const resetTotalPrice = "0";
    const resetShipmentPrice = shipmentPrice ? shipmentPrice : 0;
    const resetShipmentDistantPrice = shipmentDistantPrice
      ? shipmentDistantPrice
      : 0;

    const isChecked = false;
    return {
      id,
      merchantItemUid: resetMerchantItemUid,
      productCode: resetProductCode,
      thumbnail: product?.thumbnail || "-",
      orderProduct: resetOrderProduct,
      userName: resetUserName,
      mainReason: mainReason,
      detaildReason: detaildReason,
      refusalMainReason: refusalMainReason,
      refusalDetaildReason: refusalDetaildReason,
      orderStatus: resetOrderStatus,
      claimStatus: resetClaimStatus,
      payments: resetPayments,
      recipientName: resetRecipientName,
      recipientPhoneNumber: resetRecipientPhoneNumber,
      userEmail: resetUserEmail,
      userPhoneNumber: resetUserPhoneNumber,
      option: resetOption,
      quantity: resetQuantity,
      price: resetPrice,
      optionPrice: resetOptionPrice,
      totalPrice: resetTotalPrice,
      shipmentPrice: resetShipmentPrice,
      shipmentDistantPrice: resetShipmentDistantPrice,
      cancelRequestDay,
      cancelRefusalDay,
      cancelCompletedDay,
      totalRefundPrice,
      isChecked,
    };
  });

  return result;
};

export default resetCancelOrders;
