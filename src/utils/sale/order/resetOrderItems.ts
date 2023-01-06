import { NormalizedListType } from "@models/sale/order";
import { orderStatusNameType, ShipmentStatus } from "@constants/sale";

const resetOrderItems = (recontructOrderItem: NormalizedListType) => {
  const hasOrderItems = !!recontructOrderItem && !!recontructOrderItem.orders;
  if (!hasOrderItems) return;

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
      orderShipmentInfos,
      orderStatus,
      claimStatus,
    } = orderByid[id];

    const resetMerchantItemUid = merchantItemUid ? merchantItemUid : "-";
    const resetProductCode = product?.code ? product.code : "-";
    const resetOrderProduct = product?.name ? product.name : "-";
    const resetUserName = user?.name ? user.name : "-";
    const resetOrderStatus = orderStatus?.name
      ? orderStatusNameType[orderStatus.name]
      : "-";
    const resetClaimStatus = claimStatus?.name ? claimStatus.name : "-";
    const resetOrderShipmentInfosId = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.id
      : null;

    // 택배사
    const resetShipmentCompany = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.shipmentCompany
      : null;

    // 운송장번호
    const resetShipmentNumber = orderShipmentInfos
      ? orderShipmentInfos.filter(
          (info) => info.status === ShipmentStatus.SHIPPING
        )[0]?.shipmentNumber
      : null;

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
    const { resetOptions, resetOptionPrice, resetOptionQuantity } =
      getOptions(options);

    // 상품개수
    const resetQuantity = quantity ? quantity : resetOptionQuantity;
    // 상품가
    const resetPrice = originalPrice
      ? `${originalPrice.toLocaleString("ko-KR")}`
      : "-";

    // 상품별 총 금액
    const resetTotalPrice = getTotalPrice(
      originalPrice,
      discountAppliedPrice,
      shipmentDistantPrice,
      shipmentPrice
    );

    // 배송비
    const resetShipmentPrice = shipmentPrice
      ? `${shipmentPrice.toLocaleString("ko-KR")}`
      : "-";

    // 제주/도서 추가배송비
    const resetShipmentDistantPrice = shipmentDistantPrice
      ? `${shipmentDistantPrice.toLocaleString("ko-KR")}`
      : "-";

    const isChecked = false;
    const isShipmentInfoEdit = false;
    const temporaryShipmentCompany = resetShipmentCompany || "";
    const temporaryShipmentNumber = resetShipmentNumber || 0;

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
      // 배송정보 아이디
      orderShipmentInfosId: resetOrderShipmentInfosId,
      // 택배사
      shipmentCompany: resetShipmentCompany,
      // 운송장번호
      shipmentNumber: resetShipmentNumber,
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
      shipmentMemo: resetShipmentMemo,
      userEmail: resetUserEmail,
      userPhoneNumber: resetUserPhoneNumber,
      option: resetOptions,
      quantity: resetQuantity,
      price: resetPrice,
      optionPrice: resetOptionPrice,
      totalPrice: resetTotalPrice,
      shipmentPrice: resetShipmentPrice,
      shipmentDistantPrice: resetShipmentDistantPrice,
      isChecked,
      isShipmentInfoEdit,
      temporaryShipmentCompany,
      temporaryShipmentNumber,
    };
  });
  return result;
};

const getTotalPrice = (
  originalPrice: number,
  discountAppliedPrice: number,
  shipmentDistantPrice: number,
  shipmentPrice: number
) => {
  const shipmentDistantPay = shipmentDistantPrice || 0;
  const shipmentPay = shipmentPrice || 0;

  if (discountAppliedPrice) {
    const totalPrice = discountAppliedPrice + shipmentPay + shipmentDistantPay;
    return `${totalPrice.toLocaleString("ko-KR")}`;
  }

  if (originalPrice) {
    const totalPrice = originalPrice + shipmentPay + shipmentDistantPay;
    return `${totalPrice.toLocaleString("ko-KR")}`;
  }
};

const getOptions = (
  options: Array<{
    components: Array<{ name: string; value: string }>;
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

      result.resetOptionPrice = price;
      result.resetOptionQuantity = quantity;

      return result;
    },
    {
      resetOptions: "",
      resetOptionPrice: 0,
      resetOptionQuantity: 0,
    }
  );
};

export default resetOrderItems;
