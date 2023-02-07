import { orderStatusNameType } from "@constants/sale";
import { NormalizedType } from "@models/sale/index";
import {
  getShipmentPrice,
  getShipmentDistantPrice,
  getStatusReason,
  getOption,
  getPaymentsInfo,
} from "@utils/sale/index";
import { DateType, getDateFormat } from "@utils/date";

const getResetOrderItems = (reconstructOrderItems: NormalizedType) => {
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
      product,
      user,
      claimStatus,
      orderStatus,
      orderByShop,
      statusReasons,
      options,
      quantity,
      discountAppliedPrice,
      originalPrice,
      shipmentPrice,
      shipmentDistantPrice,
      shipmentType,
      isBundleShipment,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderByid[id];

    const {
      requestAt,
      mainReason,
      detailedReason,
      completedAt,
      amount,
      refusalAt,
      refusalReason,
      refusalDetailedReason,
    } = getStatusReason(statusReasons);

    const { optionName, optionPrice, optionQuantity } = getOption(options);
    const calculateShipmentPrice: number = getShipmentPrice(
      isBundleShipment,
      shipmentPrice,
      shipmentType,
      orderByShop
    );
    const calculateShipmentDistantPrice: number = getShipmentDistantPrice(
      isBundleShipment,
      shipmentDistantPrice,
      orderByShop
    );

    const {
      resetQuantity,
      resetOriginalPrice,
      resetDiscountPrice,
      resetOptionPrice,
      totalPrice,
      totalPaymentAmount,
    } = getPaymentsInfo(
      originalPrice,
      discountAppliedPrice,
      quantity,
      optionPrice,
      optionQuantity,
      calculateShipmentPrice,
      calculateShipmentDistantPrice
    );

    return {
      id: orderId,
      merchantUid: merchantUid || "-",
      merchantItemUid: merchantItemUid || "-",
      thumbnail: product.thumbnail || "-",
      productName: product.name || "-",
      userName: user.name || "-",
      orderStatus: orderStatus ? orderStatusNameType[orderStatus.name] : "-",
      claimStatus: claimStatus ? orderStatusNameType[claimStatus.name] : "-",
      paidAt: orderByShop?.order?.paidAt
        ? `${
            getDateFormat(orderByShop?.order?.paidAt, DateType.PAYMENT)
              .YYYY_MM_DD
          } / ${
            getDateFormat(orderByShop?.order?.paidAt, DateType.PAYMENT).HH_MM_SS
          }`
        : "-",
      requestAt: requestAt || "-",
      mainReason: mainReason || "-",
      detailedReason: detailedReason || "-",
      completedAt: completedAt || "-",
      optionName: optionName || "-",
      quantity: resetQuantity,
      originalPrice: resetOriginalPrice
        ? `${resetOriginalPrice.toLocaleString("ko-KR")}`
        : "-",
      optionPrice: resetOptionPrice
        ? `${resetOptionPrice.toLocaleString("ko-KR")}`
        : "-",
      discountPrice: resetDiscountPrice
        ? `${resetDiscountPrice.toLocaleString("ko-KR")}`
        : "-",
      totalPrice: totalPrice ? `${totalPrice.toLocaleString("ko-KR")}` : "-",
      shipmentPrice: calculateShipmentPrice
        ? `${calculateShipmentPrice.toLocaleString("ko-KR")}`
        : "-",
      shipmentDistantPrice: calculateShipmentDistantPrice
        ? `${calculateShipmentDistantPrice.toLocaleString("ko-KR")}`
        : "-",
      totalPaymentAmount: totalPaymentAmount
        ? `${totalPaymentAmount.toLocaleString("ko-KR")}`
        : "-",
      totalRefundAmout: amount ? `${amount.toLocaleString("ko-KR")}` : "-",
      userEmail: user.email || "-",
      userPhoneNumber: user.phoneNumber || "-",
      recipientName: orderByShop?.order?.recipientName || "-",
      recipientPhoneNumber: orderByShop?.order?.recipientPhoneNumber || "-",
      refusalAt: refusalAt || "-",
      refusalReason: refusalReason || "-",
      refusalDetailedReason: refusalDetailedReason || "-",

      isChecked: false,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    };
  });

  return result;
};

export default getResetOrderItems;
