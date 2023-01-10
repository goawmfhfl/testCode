export const tableWidth = {
  index: 1182,
  left: 612,
  right: 2240,

  checkbox: 36,
  merchantitemUid: 128,
  productCode: 128,
  orderProduct: 160,
  userName: 80,
  orderStatus: 80,
  claimStatus: 96,
  courier: 120,
  invoiceNumber: 216,
  paymentDay: 128,
  recipientName: 64,
  recipientPhoneNumber: 112,
  recipientAddress: 112,
  postCode: 64,
  shipmentMemo: 88,
  userEmail: 144,
  userPhoneNumber: 112,
  option: 136,
  quantity: 80,
  originalPrice: 80,
  optionPrice: 80,
  discountPrice: 136,
  totalPrice: 136,
  shipmentPrice: 64,
  shipmentDistantPrice: 136,

  totalPaymentAmount: 136,
};

export const fixTableType = [
  {
    id: 0,
    label: "checkBox",
    width: tableWidth.checkbox,
    value: "checkbox",
  },
  {
    id: 1,
    label: "주문번호",
    width: tableWidth.merchantitemUid,
    value: "merchantitemUid",
  },
  {
    id: 2,
    label: "상품 주문번호",
    width: tableWidth.productCode,
    value: "productCode",
  },
  {
    id: 3,
    label: "주문 상품",
    width: tableWidth.orderProduct,
    value: "orderProduct",
  },
  {
    id: 4,
    label: "구매자 명",
    width: tableWidth.userName,
    value: "userName",
  },
  {
    id: 5,
    label: "주문 상태",
    width: tableWidth.orderStatus,
    value: "orderStatus",
  },
];

export const scrollTableType = [
  {
    id: 0,
    label: "클레임 상태",
    width: tableWidth.claimStatus,
    value: "claimStatus",
  },
  {
    id: 1,
    label: "택배사",
    width: tableWidth.courier,
    value: "courier",
  },
  {
    id: 2,
    label: "운송장 번호",
    width: tableWidth.invoiceNumber,
    value: "invoiceNumber",
  },
  {
    id: 3,
    label: "결제일",
    width: tableWidth.paymentDay,
    value: "paymentDay",
  },
  {
    id: 4,
    label: "수취인",
    width: tableWidth.recipientName,
    value: "paymentDay",
  },
  {
    id: 5,
    label: "수취인 전화번호",
    width: tableWidth.recipientPhoneNumber,
    value: "recipientPhoneNumber",
  },
  {
    id: 6,
    label: "수취인 주소",
    width: tableWidth.recipientAddress,
    value: "recipientAddress",
  },
  {
    id: 7,
    label: "우편번호",
    width: tableWidth.postCode,
    value: "postCode",
  },
  {
    id: 8,
    label: "배송메세지",
    width: tableWidth.shipmentMemo,
    value: "shipmentMemo",
  },
  {
    id: 9,
    label: "구매자아이디",
    width: tableWidth.userEmail,
    value: "userEmail",
  },
  {
    id: 10,
    label: "구매자 전화번호",
    width: tableWidth.userPhoneNumber,
    value: "userPhoneNumber",
  },
  {
    id: 11,
    label: "옵션",
    width: tableWidth.option,
    value: "option",
  },
  {
    id: 12,
    label: "상품개수",
    width: tableWidth.quantity,
    value: "quantity",
  },
  {
    id: 13,
    label: "상품가격",
    width: tableWidth.originalPrice,
    value: "originalPrice",
  },
  {
    id: 14,
    label: "옵션가격",
    width: tableWidth.optionPrice,
    value: "optionPrice",
  },
  {
    id: 15,
    label: "상품별 할인액",
    width: tableWidth.discountPrice,
    value: "discountPrice",
  },
  {
    id: 16,
    label: "상품별 총 금액",
    width: tableWidth.totalPrice,
    value: "totalPrice",
  },
  {
    id: 17,
    label: "배송비",
    width: tableWidth.shipmentPrice,
    value: "shipmentPrice",
  },
  {
    id: 18,
    label: "제주/도서 추가배송비",
    width: tableWidth.shipmentDistantPrice,
    value: "shipmentDistantPrice",
  },
  {
    id: 19,
    label: "총 결제 금액",
    width: tableWidth.totalPaymentAmount,
    value: "totalPaymentAmount",
  },
];
