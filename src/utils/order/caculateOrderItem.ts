import { NormalizedListType } from "@models/order/orderManagement";

const caculateOrderItem = (recontructOrderItem: NormalizedListType) => {
  const orderAllIds = recontructOrderItem?.orders.allIds;
  const orderByid = recontructOrderItem?.orders.byId;

  const result = orderAllIds.map((id) => {
    const order = orderByid[id];
    const orderId = order.id;

    const orderCodeStatus = () => {
      return {
        merchantitemUid: order.merchantItemUid ? order.merchantItemUid : "-",
        productCode: order.product.code ? order.product.code : "-",
      };
    };

    const orderProductStatus = () => {
      return {
        orderProduct: order.product.name ? order.product.name : "-",
        quantity: order.quantity ? order.quantity : 0,
        price: order.discountAppliedPrice
          ? order.discountAppliedPrice
          : order.originalPrice,
        option: "옵션",
        optionPrice: "옵션가",
        totalPrice: "상품별 총금액",
      };
    };

    const shipmentStatus = () => {
      return {
        courier: "택배사",
        invoiceNumber: "운송장번호",
        shipmentPrice: order.shipmentPrice ? order.shipmentPrice : "-",
        shipmentDistantPrice: order.shipmentDistantPrice
          ? order.shipmentDistantPrice
          : "-",
      };
    };

    const orderStatus = () => {
      return {
        order: order.orderStatus?.name ? order.orderStatus?.name : "-",
        claim: order.claimStatus?.name ? order.claimStatus?.name : "-",
      };
    };

    const recipientStatus = () => {
      return {
        name: order.orderByShop.order?.recipientName
          ? order.orderByShop.order.recipientName
          : "-",
        phoneNumber: order.orderByShop.order?.recipientPhoneNumber
          ? order.orderByShop.order.recipientPhoneNumber
          : "-",
        address: order.orderByShop.order?.recipientAddress
          ? order.orderByShop.order.recipientAddress
          : "-",
        postCode: order.orderByShop.order?.postCode
          ? order.orderByShop.order.postCode
          : "-",
        shipmentMemo: order.orderByShop.order?.shipmentMemo
          ? order.orderByShop.order.shipmentMemo
          : "-",
      };
    };

    const sellerStatus = () => {
      return {
        id: order.user?.email ? order.user.email : "-",
        name: order.user?.name ? order.user.name : "-",
        phoneNumber: order.user?.phoneNumber ? order.user.phoneNumber : "-",
        paymentDay: order.user?.payments?.createdAt
          ? order.user?.payments?.createdAt
          : "-",
      };
    };

    const { merchantitemUid, productCode } = orderCodeStatus();
    const { orderProduct, quantity, price, option, optionPrice, totalPrice } =
      orderProductStatus();
    const { courier, invoiceNumber, shipmentPrice, shipmentDistantPrice } =
      shipmentStatus();

    const { order: orderState, claim: claimState } = orderStatus();
    const {
      name: recipientName,
      phoneNumber: recipientPhoneNumber,
      address,
      postCode,
      shipmentMemo,
    } = recipientStatus();

    const {
      id: sellerId,
      name: sellerName,
      phoneNumber: sellerPhoneNumber,
      paymentDay,
    } = sellerStatus();

    return {
      orderId,
      paymentDay,
      merchantitemUid,
      productCode,
      orderProduct,
      quantity,
      price,
      option,
      optionPrice,
      totalPrice,
      courier,
      invoiceNumber,
      shipmentPrice,
      shipmentDistantPrice,
      orderState,
      claimState,
      recipientName,
      recipientPhoneNumber,
      address,
      postCode,
      shipmentMemo,
      sellerId,
      sellerName,
      sellerPhoneNumber,
    };
  });
  return result;
};

export default caculateOrderItem;
