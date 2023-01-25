import { NormalizedListType } from "@models/sale/order";
import {
  orderStatusNameType,
  ShipmentStatus,
  ShipmentType,
} from "@constants/sale";
import { getDateFormat } from "@utils/date";

const resetOrderItems = (recontructOrderItem: NormalizedListType) => {
  const hasOrderItems = !!recontructOrderItem && !!recontructOrderItem.orders;
  if (!hasOrderItems) return;

  const orderAllIds = recontructOrderItem?.orders.allIds;
  const orderByid = recontructOrderItem?.orders.byId;

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
      orderShipmentInfos,
      orderStatus,
      claimStatus,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderByid[id];

    const resetMerchantUid = merchantUid ? merchantUid : "-";
    const resetMerchantItemUid = merchantItemUid ? merchantItemUid : "-";
    const resetProductCode = product?.code ? product.code : "-";
    const resetOrderProduct = product?.name ? product.name : "-";
    const resetProductThumbnail = product?.thumbnail ? product.thumbnail : "-";
    const resetUserName = user?.name ? user.name : "-";
    const resetPaidAt = orderByShop?.order
      ? `${getDateFormat(orderByShop?.order.paidAt).YYYY_MM_DD} / ${
          getDateFormat(orderByShop?.order.paidAt).HH_MM_SS
        }`
      : "-";

    const resetOrderStatus = orderStatus?.name
      ? orderStatusNameType[orderStatus.name]
      : "-";
    const resetClaimStatus = claimStatus?.name ? claimStatus.name : "-";
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

    const resetRecipientName = orderByShop?.order?.recipientName
      ? orderByShop.order.recipientName
      : "-";
    const resetRecipientPhoneNumber = orderByShop?.order?.recipientPhoneNumber
      ? orderByShop.order.recipientPhoneNumber
      : "-";
    const resetRecipientAddress = orderByShop?.order?.recipientAddress
      ? orderByShop.order.recipientAddress
      : "-";
    const resetPostCode = orderByShop?.order?.postCode
      ? orderByShop.order.postCode
      : "-";
    const resetShipmentMemo = orderByShop?.order?.shipmentMemo
      ? orderByShop.order.shipmentMemo
      : "-";
    const resetUserEmail = user?.email ? user.email : "-";
    const resetUserPhoneNumber = user?.phoneNumber ? user.phoneNumber : "-";
    const { resetOptions, resetOptionPrice, resetOptionQuantity } =
      getOptions(options);
    const resetQuantity = quantity ? quantity : resetOptionQuantity;
    const resetPrice = originalPrice
      ? `${(resetQuantity * originalPrice).toLocaleString("ko-KR")}`
      : "-";
    const resetDiscountPrice = discountAppliedPrice
      ? `${(
          (discountAppliedPrice - originalPrice) *
          resetQuantity
        ).toLocaleString("ko-KR")}`
      : "-";

    const totalPrice = getTotalPrice(
      resetPrice,
      resetDiscountPrice,
      resetOptionPrice
    );

    const resetShipmentPrice = getShipmentPrice(shipmentPrice, shipmentType);
    const resetShipmentDistantPrice = shipmentDistantPrice
      ? `${shipmentDistantPrice.toLocaleString("ko-KR")}`
      : "-";
    const totalPaymentAmount = getTotalPaymentAmount(
      totalPrice,
      resetShipmentPrice,
      resetShipmentDistantPrice
    );

    const isChecked = false;
    const isShipmentInfoEdit = false;
    const temporaryShipmentCompany = resetShipmentCompany || "";
    const temporaryShipmentNumber = resetShipmentNumber || 0;

    return {
      id: orderId,
      merchantUid: resetMerchantUid,
      merchantItemUid: resetMerchantItemUid,
      productCode: resetProductCode,
      thumbnail: resetProductThumbnail,
      orderProduct: resetOrderProduct,
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
      shipmentMemo: resetShipmentMemo,
      userEmail: resetUserEmail,
      userPhoneNumber: resetUserPhoneNumber,
      option: resetOptions,
      quantity: resetQuantity,
      price: resetPrice,
      optionPrice: resetOptionPrice,
      discountPrice: resetDiscountPrice,
      totalPrice,
      shipmentPrice: resetShipmentPrice,
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

const getTotalPaymentAmount = (
  totalPrice: string,
  resetShipmentPrice: string,
  resetShipmentDistantPrice: string
) => {
  if (!totalPrice) {
    return "-";
  }

  const resetTotalPrice =
    totalPrice !== "-" && Number(totalPrice.replace(",", ""))
      ? Number(totalPrice.replace(",", ""))
      : 0;
  const shipmentPrice =
    resetShipmentPrice !== "-" && Number(resetShipmentPrice.replace(",", ""))
      ? Number(resetShipmentPrice.replace(",", ""))
      : 0;

  const shipmentDistantPrice =
    resetShipmentDistantPrice !== "-" &&
    Number(resetShipmentDistantPrice.replace(",", ""))
      ? Number(resetShipmentDistantPrice.replace(",", ""))
      : 0;

  const result = resetTotalPrice + shipmentPrice + shipmentDistantPrice;

  return result ? `${result.toLocaleString("ko-KR")}` : "-";
};

const getTotalPrice = (
  price: string,
  discountPrice: string,
  optionPrice: string
) => {
  const resetoriginalPrice =
    price !== "-" && Number(price.replace(",", ""))
      ? Number(price.replace(",", ""))
      : 0;
  const resetDiscountPrice =
    discountPrice !== "-" && Number(discountPrice.replace(",", ""))
      ? Number(discountPrice.replace(",", ""))
      : 0;
  const resetOptionPrice =
    optionPrice !== "-" && Number(optionPrice.replace(",", ""))
      ? Number(optionPrice.replace(",", ""))
      : 0;

  if (!resetoriginalPrice && !resetDiscountPrice && !resetOptionPrice) {
    return "-";
  }

  const result = resetoriginalPrice + resetOptionPrice + resetDiscountPrice;

  return `${result.toLocaleString("ko-KR")}`;
};

const getOptions = (
  options: Array<{
    components?: Array<{ name: string; value: string }>;
    quantity: number;
    price: number;
    isRequired: boolean;
  }>
) => {
  const hasOptions = !!options && !!options.length;
  if (!hasOptions) {
    return {
      resetOptions: "-",
      resetOptionPrice: "-",
      resetOptionQuantity: 0,
    };
  }

  return options.reduce(
    (result, { components, price, quantity }) => {
      const hasComponents = !!components && !!components.length;

      if (hasComponents) {
        result.resetOptions += components.reduce(
          (components, { name, value }) => {
            if (components) {
              components += `/ ${name} : ${value} `;
            }
            if (!components) {
              components = `${name} : ${value} `;
            }

            return components;
          },
          ""
        );
      }

      if (!hasComponents) {
        result.resetOptions = "-";
      }

      result.resetOptionPrice = price
        ? `${(price * quantity).toLocaleString("ko-KR")}`
        : "-";

      result.resetOptionQuantity = quantity;

      return result;
    },
    {
      resetOptions: "",
      resetOptionPrice: "-",
      resetOptionQuantity: 0,
    }
  );
};

const getShipmentPrice = (
  shipmentPrice: number,
  shipmentType: ShipmentType
) => {
  if (!shipmentPrice) return "-";
  if (shipmentType === ShipmentType.FREE) return "-";
  if (shipmentType === ShipmentType.CHARGE)
    return `${shipmentPrice.toLocaleString("ko-KR")}`;
  if (shipmentType === ShipmentType.CONDITIONAL_FREE) return "-";
};

export default resetOrderItems;
