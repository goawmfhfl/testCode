import { NormalizedListType } from "@models/sale";
import { orderStatusNameType } from "@constants/sale";

const resetOrderItems = (recontructOrderItem: NormalizedListType) => {
  if (!recontructOrderItem || !recontructOrderItem.orders) return;

  const orderAllIds = recontructOrderItem?.orders.allIds;
  const orderByid = recontructOrderItem?.orders.byId;

  const result = orderAllIds.map((id) => {
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
      orderStatus,
      claimStatus,
    } = orderByid[id];

    // 주문번호
    const resetMerchantItemUid = merchantItemUid ? merchantItemUid : "-";

    // 상품 주문번호
    const resetProductCode = product?.code ? product.code : "-";

    // 주문 상품
    const resetOrderProduct = product?.name ? product.name : "-";

    // 구매자 명
    const resetUserName = user?.name ? user.name : "-";

    // 주문 상태
    const resetOrderStatus = orderStatus?.name
      ? orderStatusNameType[orderStatus.name]
      : "-";

    // 클레임 상태
    const resetClaimStatus = claimStatus?.name ? claimStatus.name : "-";

    // 택배사
    const resetCourier = "-";

    // 운송장번호
    const resetInvoiceNumber = "-";

    // 결제일
    const resetPayments = user?.payments?.createdAt
      ? user.payments.createdAt
      : "-";

    // 수취인
    const resetRecipientName = orderByShop?.order?.recipientName
      ? orderByShop.order.recipientName
      : "-";

    // 수취인 전화번호
    const resetRecipientPhoneNumber = orderByShop?.order?.recipientPhoneNumber
      ? orderByShop.order.recipientPhoneNumber
      : "-";

    // 수취인 주소
    const resetRecipientAddress = orderByShop?.order?.recipientAddress
      ? orderByShop.order.recipientAddress
      : "-";

    // 우편번호
    const resetPostCode = orderByShop?.order?.postCode
      ? orderByShop.order.postCode
      : "-";

    // 배송메세지
    const resetShipmentMemo = orderByShop?.order?.shipmentMemo
      ? orderByShop.order.shipmentMemo
      : "-";

    // 구매자 아이디
    const resetUserEmail = user?.email ? user.email : "-";

    // 구매자 전화번호
    const resetUserPhoneNumber = user?.phoneNumber ? user.phoneNumber : "-";

    // 옵션
    const resetOption = "-";

    // 상품개수
    const resetQuantity = quantity ? quantity : 0;

    // 상품가
    const resetPrice = discountAppliedPrice
      ? discountAppliedPrice
      : originalPrice
      ? originalPrice
      : 0;

    // 옵션가
    const resetOptionPrice = "-";

    // 상품별 총 금액
    const resetTotalPrice = "0";

    // 배송비
    const resetShipmentPrice = shipmentPrice ? shipmentPrice : 0;

    // 제주/도서 추가배송비
    const resetShipmentDistantPrice = shipmentDistantPrice
      ? shipmentDistantPrice
      : 0;

    const isChecked = false;

    return {
      id,
      // 주문번호
      merchantItemUid: resetMerchantItemUid,
      // 상품 주문번호
      productCode: resetProductCode,
      // 주문 상품
      thumbnail: product?.thumbnail ? product?.thumbnail : "-",
      orderProduct: resetOrderProduct,
      // 구매자 명
      userName: resetUserName,
      // 주문 상태
      orderStatus: resetOrderStatus,
      // 클레임 상태
      claimStatus: resetClaimStatus,
      // 택배사
      courier: resetCourier,
      // 운송장번호
      invoiceNumber: resetInvoiceNumber,
      // 결제일
      payments: resetPayments,
      // 수취인
      recipientName: resetRecipientName,
      // 수취인 전화번호
      recipientPhoneNumber: resetRecipientPhoneNumber,
      // 수취인 주소
      recipientAddress: resetRecipientAddress,
      // 우편번호
      postCode: resetPostCode,
      // 배송메세지
      shipmentMemo: resetShipmentMemo,
      // 구매자 아이디
      userEmail: resetUserEmail,
      // 구매자 전화번호
      userPhoneNumber: resetUserPhoneNumber,
      // 옵션
      option: resetOption,
      // 상품개수
      quantity: resetQuantity,
      // 상품가
      price: resetPrice,
      // 옵션가
      optionPrice: resetOptionPrice,
      // 상품별 총 금액
      totalPrice: resetTotalPrice,
      // 배송비
      shipmentPrice: resetShipmentPrice,
      // 제주/도서 추가배송비
      shipmentDistantPrice: resetShipmentDistantPrice,
      isChecked,
    };
  });
  return result;
};

export default resetOrderItems;
