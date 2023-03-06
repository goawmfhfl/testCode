import { orderStatusNameType } from "@constants/sale";
import { NormalizedListType } from "@models/sale";
import { DateType, getDateFormat } from "@utils/date";
import {
  getShipmentPrice,
  getShipmentDistantPrice,
  getShipmentInfos,
  getOption,
  getPaymentsInfo,
} from "@utils/sale/index";

const resetOrderItems = (reconstructOrderItems: NormalizedListType) => {
  const hasOrderItems =
    !!reconstructOrderItems && !!reconstructOrderItems.orderItems;
  if (!hasOrderItems) return;

  const allIds = reconstructOrderItems?.orderItems.allIds;
  const orderItemById = reconstructOrderItems?.orderItems.byId;

  const result = allIds.map((id) => {
    const {
      id: orderId,
      merchantUid,
      merchantItemUid,
      thumbnail,
      name,
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
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderItemById[id];

    const {
      shipmentOrderId,
      shipmentCompany: shippingShipmentCompany,
      shipmentNumber: shippingShipmentNumber,
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
      thumbnail: thumbnail || "-",
      productName: name || "-",
      userName: user?.name || "-",
      orderStatus: orderStatus
        ? (orderStatusNameType[orderStatus.name] as string)
        : "-",
      claimStatus: claimStatus
        ? (orderStatusNameType[claimStatus.name] as string)
        : "-",
      shipmentOrderId,
      shipmentCompany: shippingShipmentCompany,
      shipmentNumber: shippingShipmentNumber,
      paidAt: orderByShop?.order?.paidAt
        ? `${getDateFormat(orderByShop?.order?.paidAt).YYYY_MM_DD} / ${
            getDateFormat(orderByShop?.order?.paidAt).HH_MM_SS
          }`
        : "-",
      recipientName: orderByShop?.order?.recipientName || "-",
      recipientPhoneNumber: orderByShop?.order?.recipientPhoneNumber || "-",
      recipientAddress: orderByShop?.order?.recipientAddress || "-",
      postCode: orderByShop?.order?.postCode || "-",
      shipmentMemo: orderByShop?.order?.shipmentMemo || "-",
      userEmail: user?.email || "-",
      userPhoneNumber: user?.phoneNumber || "-",
      option: optionName || "-",
      quantity: resetQuantity,
      price: resetOriginalPrice
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

      isChecked: false,
      isShipmentInfoEdit: false,
      temporaryShipmentCompany: shippingShipmentCompany || "",
      temporaryShipmentNumber: shippingShipmentNumber || 0,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    };
  });

  return result;
};

export default resetOrderItems;
