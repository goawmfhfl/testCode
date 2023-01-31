import React from "react";
import { NormalizedType } from "@models/sale/cancel";
import {
  MainReason,
  mainReasonType,
  OrderStatusName,
  orderStatusNameType,
  ShipmentType,
} from "@constants/sale";

import { getDateFormat } from "@utils/date";

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
      shipmentPrice: individualShipmentPrice,
      shipmentDistantPrice: individualShipmentDistantPrice,
      shipmentType,
      isBundleShipment,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    } = orderByid[id];

    const { thumbnail, name: productName } = getProducts(product);
    const {
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
    } = getUser(user);

    const resetOrderStatus = orderStatus
      ? orderStatusNameType[orderStatus.name]
      : "-";

    const resetClaimStatus = claimStatus
      ? orderStatusNameType[claimStatus.name]
      : "-";

    const { recipientName, recipientPhoneNumber, postCode, paidAt } =
      getOrder(orderByShop);

    const {
      requestCancelAt,
      mainReason,
      detailedReason,
      completedCancelAt,
      amount,
      refusalCancelAt,
      refusalReason,
      refusalDateaildReason,
    } = getStatusReason(statusReasons);

    const { optionName, optionPrice, optionQuantity } = getOption(options);
    const discountPrice = getDiscountPrice(originalPrice, discountAppliedPrice);
    const totalPrice = getTotalPrice(
      originalPrice,
      discountAppliedPrice,
      optionPrice
    );

    const shipmentPrice = getShipmentPrice(
      isBundleShipment,
      individualShipmentPrice,
      shipmentType,
      orderByShop
    );

    const shipmentDistantPrice = 0;

    const totalPaymentAmount = getTotalPaymentAmount(
      originalPrice,
      discountAppliedPrice,
      optionPrice,
      shipmentPrice,
      shipmentDistantPrice
    );

    const isChecked = false;

    return {
      id: orderId,
      merchantUid,
      merchantItemUid,
      thumbnail,
      productName,
      userName,
      orderStatus: resetOrderStatus,
      claimStatus: resetClaimStatus,
      paidAt,
      requestCancelAt,
      mainReason,
      detailedReason,
      completedCancelAt,
      optionName,
      optionQuantity: quantity ? quantity : optionQuantity,
      originalPrice: originalPrice
        ? `${originalPrice.toLocaleString("ko-KR")}`
        : "-",
      optionPrice: optionPrice ? `${optionPrice.toLocaleString("ko-KR")}` : "-",
      discountPrice: discountPrice
        ? `${discountPrice.toLocaleString("ko-KR")}`
        : "-",
      totalPrice: totalPrice ? `${totalPrice.toLocaleString("ko-KR")}` : "-",
      shipmentPrice: shipmentPrice
        ? `${shipmentPrice.toLocaleString("ko-KR")}`
        : "-",
      shipmentDistantPrice: "-",
      // shipmentDistantPrice
      //   ? `${shipmentDistantPrice.toLocaleString("ko-KR")}`
      //   : "-",
      totalPaymentAmount: totalPaymentAmount
        ? `${totalPaymentAmount.toLocaleString("ko-KR")}`
        : "-",
      totalRefundAmout: amount ? `${amount.toLocaleString("ko-KR")}` : "-",
      userEmail,
      userPhoneNumber,
      recipientName,
      recipientPhoneNumber,
      refusalCancelAt,
      refusalReason,
      refusalDateaildReason,

      isChecked,
      colorIndex,
      rowIndex,
      isLastRow,
      isFirstRow,
    };
  });

  return result;
};

const getProducts = (products: { thumbnail: string; name: string }) => {
  const hasProducts = !!products;

  if (!hasProducts)
    return {
      thumbnail: "",
      name: "-",
    };

  return {
    thumbnail: products.thumbnail,
    name: products.name,
  };
};

const getUser = (user: {
  name: string;
  email: string;
  phoneNumber: string;
}) => {
  const hasUser = !!user;
  if (!hasUser)
    return {
      name: "-",
      email: "-",
      phoneNumber: "-",
    };

  const { name, email, phoneNumber } = user;

  return {
    name: name ? name : "-",
    email: email ? email : "-",
    phoneNumber: phoneNumber ? phoneNumber : "-",
  };
};

const getOrder = (orderByShop: {
  order: {
    recipientName: string;
    recipientPhoneNumber: string;
    recipientAddress: string;
    postCode: number;
    shipmentMemo: string;
    paidAt: string;
  };
}) => {
  const hasOrder = !!orderByShop && !!orderByShop.order;
  if (!hasOrder)
    return {
      recipientName: "-",
      recipientPhoneNumber: "-",
      recipientAddress: "-",
      postCode: "-",
      shipmentMemo: "-",
      paidAt: "-",
    };

  const {
    recipientName,
    recipientPhoneNumber,
    recipientAddress,
    postCode,
    shipmentMemo,
    paidAt,
  } = orderByShop.order;

  return {
    recipientName: recipientName ? recipientName : "-",
    recipientPhoneNumber: recipientPhoneNumber ? recipientPhoneNumber : "-",
    recipientAddress: recipientAddress ? recipientAddress : "-",
    postCode: postCode ? postCode : "-",
    shipmentMemo: shipmentMemo ? shipmentMemo : "-",
    paidAt: paidAt
      ? `${getDateFormat(paidAt).YYYY_MM_DD} / ${
          getDateFormat(paidAt).HH_MM_SS
        }`
      : "-",
  };
};

const getStatusReason = (
  statusReason: Array<{
    createdAt: string;
    amount: number;
    mainReason: MainReason;
    detailedReason: string;
    status: OrderStatusName;
  }>
) => {
  const statusReasonInitailValue = {
    requestCancelAt: "",
    mainReason: "",
    detailedReason: "",
    completedCancelAt: "",
    amount: 0,
    refusalCancelAt: "",
    refusalReason: "",
    refusalDateaildReason: "",
  };

  const hasStatusReason = !!statusReason && !!statusReason.length;
  if (!hasStatusReason) {
    return {
      requestCancelAt: "",
      mainReason: "",
      detailedReason: "",
      completedCancelAt: "",
      amount: 0,
      refusalCancelAt: "",
      refusalReason: "",
      refusalDateaildReason: "",
    };
  }

  return statusReason.reduce(
    (result, { createdAt, amount, mainReason, detailedReason, status }) => {
      if (status === OrderStatusName.CANCEL_REQUEST) {
        result.mainReason = mainReasonType[mainReason];
        result.detailedReason = detailedReason;
        result.requestCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
      }

      if (status === OrderStatusName.CANCEL_COMPLETED) {
        result.requestCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
        result.amount = amount;
      }

      if (status === OrderStatusName.CANCEL_REFUSAL) {
        result.refusalReason = mainReasonType[mainReason];
        result.refusalDateaildReason = detailedReason;
        result.refusalCancelAt = `${getDateFormat(createdAt).YYYY_MM_DD} / ${
          getDateFormat(createdAt).HH_MM_SS
        }`;
      }

      return result;
    },
    statusReasonInitailValue
  );
};

const getOption = (
  options: Array<{
    id: number;
    components: Array<{
      name: string;
      value: string;
    }>;
    quantity: number;
    price: number;
    isRequired: boolean;
  }>
) => {
  const optioninitailValue = {
    optionName: "",
    optionPrice: 0,
    optionQuantity: 0,
  };
  const hasOption = !!options && !!options.length;
  if (!hasOption)
    return {
      optionName: "",
      optionPrice: 0,
      optionQuantity: 0,
    };

  return options.reduce((result, { components, quantity, price }) => {
    result.optionName += components.reduce((component, { name, value }) => {
      if (component) {
        component += `/ ${name} : ${value} `;
      }
      if (!component) {
        component = `${name} : ${value} `;
      }
      return component;
    }, "");

    result.optionQuantity = quantity;
    result.optionPrice = quantity * price;

    return result;
  }, optioninitailValue);
};

const getDiscountPrice = (
  originalPrice: number,
  discountAppliedPrice: number
) => {
  if (!discountAppliedPrice) return 0;

  return discountAppliedPrice - originalPrice;
};

const getTotalPrice = (
  originalPrice: number,
  discountAppliedPrice: number,
  optionPrice: number
) => {
  return originalPrice + optionPrice + discountAppliedPrice;
};

const getShipmentPrice = (
  isBundleShipment: boolean,
  shipmentPrice: number,
  shipmentType: ShipmentType,
  orderByShop: {
    bundleShipmentPrice: number;
    bundleShipmentDistantPrice: number;
    bundleShipmentType: ShipmentType;
    bundleOrderItemTotalPrice: number;
    shipmentConditionalPrice: number;
  }
) => {
  if (!shipmentPrice) return 0;

  if (isBundleShipment) {
    if (shipmentType === ShipmentType.FREE) {
      return 0;
    }
    if (shipmentType === ShipmentType.CHARGE) {
      return shipmentPrice;
    }
  }

  if (!isBundleShipment && !!orderByShop) {
    const {
      bundleShipmentType,
      bundleShipmentPrice,
      bundleOrderItemTotalPrice,
      shipmentConditionalPrice,
    } = orderByShop;

    if (bundleShipmentType === ShipmentType.FREE) {
      return 0;
    }
    if (bundleShipmentType === ShipmentType.CHARGE) {
      return bundleShipmentPrice;
    }
    if (bundleShipmentType === ShipmentType.CONDITIONAL_FREE) {
      const isConditionalFree =
        bundleOrderItemTotalPrice > shipmentConditionalPrice;

      return isConditionalFree ? 0 : bundleShipmentPrice;
    }
  }
};

const getTotalPaymentAmount = (
  originalPrice: number,
  discountAppliedPrice: number,
  optionPrice: number,
  shipmentPrice: number,
  shipmentDistantPrice: number
) => {
  const result =
    originalPrice +
    discountAppliedPrice +
    optionPrice +
    shipmentPrice +
    shipmentDistantPrice;
  return result;
};

export default getResetOrderItems;
