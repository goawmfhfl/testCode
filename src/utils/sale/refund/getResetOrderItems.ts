import { NormalizedListType } from "@models/sale/order";
import { orderStatusNameType } from "@constants/sale";
import { DateType, getDateFormat } from "@utils/date";

import {
  getShipmentPrice,
  getShipmentDistantPrice,
  getStatusReason,
  getShipmentInfos,
  getOption,
  getPaymentsInfo,
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
      product,
      user,
      orderByShop,
      options,
      quantity,
      discountAppliedPrice,
      originalPrice,
      shipmentPrice,
      shipmentDistantPrice,
      shipmentType,
      isBundleShipment,
      orderShipmentInfos,
      orderStatus,
      claimStatus,
      statusReasons,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderByid[id];

    const {
      attachedImages,
      requestAt,
      mainReason,
      detailedReason,
      reasonStatus,
      statusReasonId,
      completedAt,
      refusalAt,
      refusalReason,
      refusalDetailedReason,
      refusalReasonStatus,
      refusalStatusReasonId,
      amount,
    } = getStatusReason(statusReasons);

    console.log([{ reasonStatus }, { refusalReasonStatus }]);

    const {
      shipmentOrderId,
      shipmentCompany: shippingShipmentCompany,
      shipmentNumber: shippingShipmentNumber,
      refundOrderId,
      refundShipmentCompany,
      refundShipmentNumber,
    } = getShipmentInfos(orderShipmentInfos);

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
      thumbnail: product?.thumbnail || "-",
      productName: product?.name || "-",
      userName: user?.name || "-",
      orderStatus: orderStatus?.name
        ? orderStatusNameType[orderStatus.name]
        : "-",
      claimStatus: claimStatus?.name
        ? orderStatusNameType[claimStatus.name]
        : "-",
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
      reasonStatus,
      statusReasonId,
      attachedImages:
        !!attachedImages && !!attachedImages.length ? attachedImages : null,
      completedAt: completedAt || "-",

      shipmentOrderId,
      shipmentCompany: shippingShipmentCompany,
      shipmentNumber: shippingShipmentNumber,
      refundOrderId,
      refundShipmentCompany,
      refundShipmentNumber,

      option: optionName || "-",
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
      amount: amount ? `${amount.toLocaleString("ko-KR")}` : "-",

      recipientName: orderByShop?.order?.recipientName || "-",
      recipientPhoneNumber: orderByShop?.order?.recipientPhoneNumber || "-",
      recipientAddress: orderByShop?.order?.recipientAddress || "-",
      postCode: orderByShop?.order?.postCode || "-",
      userEmail: user?.email || "-",
      userPhoneNumber: user?.phoneNumber || "-",
      refusalAt: refusalAt || "-",
      refusalReason,
      refusalDetailedReason: refusalDetailedReason || "-",
      refusalReasonStatus,
      refusalStatusReasonId,

      isChecked: false,
      isShipmentInfoEdit: false,
      temporaryShipmentCompany: shippingShipmentCompany || "",
      temporaryShipmentNumber: shippingShipmentNumber || 0,

      isRefundShipmentInfoEdit: false,
      temporaryRefundShipmentCompany: refundShipmentCompany || "",
      temporaryRefundShipmentNumber: refundShipmentNumber || 0,

      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    };
  });
  return result;
};

export default getResetOrderItems;
