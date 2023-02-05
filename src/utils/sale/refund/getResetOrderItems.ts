import { NormalizedListType } from "@models/sale/order";
import {
  orderStatusNameType,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";
import { DateType, getDateFormat } from "@utils/date";
import {
  getStatusReason,
  getOption,
  getDiscountPrice,
  getTotalPrice,
  getShipmentPrice,
  getTotalPaymentAmount,
} from "@utils/sale/index";

const getResetOrderItems = (reconstructOrderItems: NormalizedListType) => {
  const hasOrderItems =
    !!reconstructOrderItems && !!reconstructOrderItems.orders;
  if (!hasOrderItems) return;

  const orderAllIds = reconstructOrderItems?.orders.allIds;
  const orderByid = reconstructOrderItems?.orders.byId;

  const result = orderAllIds.map((id) => {
    const {
      id: orderId,
      merchantUid,
      merchantItemUid,
      product: { thumbnail, name: productName },
      user: { name: userName, phoneNumber: userPhoneNumber, email: userEmail },
      orderByShop: {
        order: {
          paidAt,
          recipientName,
          recipientAddress,
          recipientPhoneNumber,
          postCode,
        },
        shipmentConditionalPrice,
        bundleOrderItemTotalPrice,
        bundleShipmentDistantPrice,
        bundleShipmentPrice,
        bundleShipmentType,
      },
      options,
      quantity,
      discountAppliedPrice,
      originalPrice,
      shipmentPrice,
      shipmentDistantPrice,
      shipmentType,
      isBundleShipment,
      orderShipmentInfos,
      orderStatus: { name: orderStatus },
      claimStatus: { name: claimStatus },
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderByid[id];

    const resetMerchantUid = merchantUid ? merchantUid : "-";
    const resetMerchantItemUid = merchantItemUid ? merchantItemUid : "-";
    const resetProductName = productName ? productName : "-";
    const resetProductThumbnail = thumbnail ? thumbnail : "-";
    const resetUserName = userName ? userName : "-";
    const resetPaidAt = paidAt
      ? `${getDateFormat(paidAt, DateType.PAYMENT).YYYY_MM_DD} / ${
          getDateFormat(paidAt, DateType.PAYMENT).HH_MM_SS
        }`
      : "-";

    const resetOrderStatus = orderStatus
      ? orderStatusNameType[orderStatus]
      : "-";
    const resetClaimStatus = claimStatus
      ? orderStatusNameType[claimStatus]
      : "-";
    const resetOrderShipmentInfosId = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.id
      : null;
    const resetShipmentCompany = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.shipmentCompany
      : null;
    const resetShipmentNumber = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.shipmentNumber
      : null;

    const resetRecipientName = recipientName ? recipientName : "-";
    const resetRecipientPhoneNumber = recipientPhoneNumber
      ? recipientPhoneNumber
      : "-";
    const resetRecipientAddress = recipientAddress ? recipientAddress : "-";
    const resetPostCode = postCode ? postCode : "-";
    const resetUserEmail = userEmail ? userEmail : "-";
    const resetUserPhoneNumber = userPhoneNumber ? userPhoneNumber : "-";
    const { optionName, optionPrice, optionQuantity } = getOption(options);

    const resetQuantity = quantity ? quantity : optionQuantity;
    const discountPrice = 0;

    const totalPrice = 0;

    const resetShipmentDistantPrice = shipmentDistantPrice
      ? `${shipmentDistantPrice.toLocaleString("ko-KR")}`
      : "-";

    const totalPaymentAmount = 0;

    const isChecked = false;
    const isShipmentInfoEdit = false;
    const temporaryShipmentCompany = resetShipmentCompany || "";
    const temporaryShipmentNumber = resetShipmentNumber || 0;

    return {
      id: orderId,
      merchantUid: resetMerchantUid,
      merchantItemUid: resetMerchantItemUid,
      thumbnail: resetProductThumbnail,
      productName: resetProductName,
      userName: resetUserName,
      orderStatus: resetOrderStatus,
      claimStatus: resetClaimStatus,
      orderShipmentInfosId: resetOrderShipmentInfosId,
      shipmentCompany: resetShipmentCompany,
      shipmentNumber: resetShipmentNumber,
      paidAt: resetPaidAt,
      recipientName: resetRecipientName,
      recipientPhoneNumber: resetRecipientPhoneNumber,
      recipientAddress: resetRecipientAddress,
      postCode: resetPostCode,
      userEmail: resetUserEmail,
      userPhoneNumber: resetUserPhoneNumber,
      quantity: resetQuantity,
      totalPrice,
      shipmentPrice: null,
      shipmentDistantPrice: resetShipmentDistantPrice,
      totalPaymentAmount,
      isChecked,
      isShipmentInfoEdit,
      temporaryShipmentCompany,
      temporaryShipmentNumber,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    };
  });
  return result;
};

export default getResetOrderItems;
