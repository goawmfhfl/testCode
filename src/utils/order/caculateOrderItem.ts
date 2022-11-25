import { NormalizedListType } from "@models/order/orderManagement";

const caculateOrderItem = (recontructOrderItem: NormalizedListType) => {
  const orderAllIds = recontructOrderItem?.orders.allIds;
  const orderByid = recontructOrderItem?.orders.byId;

  const result = orderAllIds.map((id) => {
    const order = orderByid[id];

    const orderId = order.id;

    const paymentDay = "결제일";

    const orderCodeStatus = () => {
      return {
        merchantitemUid: order.merchantItemUid,
        productCode: order.product.code,
      };
    };

    const orderProductStatus = () => {
      return {
        orderProduct: order.product.name,
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
        shipmentPrice: order.shipmentPrice,
        shipmentDistantPrice: "제주/도서 추가배송비",
      };
    };

    const orderStatus = () => {
      return {
        order: "주문 상태",
        claim: "클레임 상태",
      };
    };

    const recipientStatus = () => {
      return {
        name: order.orderByShop.order.recipientName,
        phoneNumber: order.orderByShop.order.recipientPhoneNumber,
        address: order.orderByShop.order.recipientAddress,
        postCode: order.orderByShop.order.postCode,
        shipmentMemo: order.orderByShop.order.shipmentMemo,
      };
    };

    const sellerStatus = () => {
      return {
        id: "구매자 아이디",
        name: "구매자명",
        phoneNumber: "구매자 전화번호",
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
