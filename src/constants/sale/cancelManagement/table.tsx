export const tableWidth = {
  index: 1182,
  left: 708,
  right: 2824,

  //체크박스
  checkBox: 36,

  // 주문번호
  merchantitemUid: 128,

  // 상품 주 문번호
  productCode: 128,

  // 주문 상품
  orderProduct: 160,

  // 구매자명
  userName: 80,

  // 주문상태
  orderStatus: 80,

  // 클레임 상태
  claimStatus: 96,

  // 결제일
  paidAt: 128,

  // 취소요청일
  requestCancelDay: 128,

  // 대표사유
  reason: 180,

  // 상세사유
  detailReason: 200,

  // 취소 완료일
  cancelCompletedDay: 128,

  //옵션
  option: 136,

  //상품개수
  quantity: 80,

  //상품가격
  price: 80,

  //옵션가
  optionPrice: 80,

  //상품별 할인액
  discountPrice: 136,

  //상품별 총 금액
  totalPrice: 136,

  // 배송비
  shipmentPrice: 64,

  // 제주/도서 추가배송비
  shipmentDistantPrice: 136,

  // 총 결제 금액
  totalPaymentAmount: 136,

  // 총 환불 금액
  totalRefundAmount: 136,

  // 구매자 아이디
  userEmail: 144,

  // 구매자 전화번호
  userPhoneNumber: 112,

  // 수취인
  recipientName: 64,

  // 수취인 전화번호
  recipientPhoneNumber: 112,

  // 취소거절일
  rejectCancelDay: 128,

  // 거절대표사유
  rejectReason: 180,

  // 거절상세사유
  detailRejectReason: 200,
};

export const fixTableType = [
  {
    id: 0,
    label: "checkBox",
    width: tableWidth.checkBox,
    value: "checkBox",
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
  {
    id: 6,
    label: "클래임 상태",
    width: tableWidth.claimStatus,
    value: "claimStatus",
  },
];

export const scrollTableType = [
  {
    id: 0,
    label: "결제일",
    width: tableWidth.paidAt,
    value: "paidAt",
  },
  {
    id: 1,
    label: "취소요청일",
    width: tableWidth.requestCancelDay,
    value: "requestCancelDay",
  },
  {
    id: 2,
    label: "대표사유",
    width: tableWidth.reason,
    value: "reason",
  },
  {
    id: 3,
    label: "상세사유",
    width: tableWidth.detailReason,
    value: "detailReason",
  },
  {
    id: 4,
    label: "취소 완료일",
    width: tableWidth.cancelCompletedDay,
    value: "cancelCompletedDay",
  },
  {
    id: 5,
    label: "옵션",
    width: tableWidth.option,
    value: "option",
  },
  {
    id: 6,
    label: "상품개수",
    width: tableWidth.quantity,
    value: "quantity",
  },
  {
    id: 7,
    label: "상품가격",
    width: tableWidth.price,
    value: "price",
  },
  {
    id: 8,
    label: "옵션가격",
    width: tableWidth.optionPrice,
    value: "optionPrice",
  },
  {
    id: 9,
    label: "상품별 할인액",
    width: tableWidth.discountPrice,
    value: "discountPrice",
  },
  {
    id: 10,
    label: "상품별 총 금액",
    width: tableWidth.totalPrice,
    value: "totalPrice",
  },
  {
    id: 11,
    label: "배송비",
    width: tableWidth.shipmentPrice,
    value: "shipmentPrice",
  },
  {
    id: 12,
    label: "제주/도서 추가배송비",
    width: tableWidth.shipmentDistantPrice,
    value: "shipmentDistantPrice",
  },
  {
    id: 13,
    label: "총 결제 금액",
    width: tableWidth.totalPaymentAmount,
    value: "totalPaymentAmount",
  },

  {
    id: 14,
    label: "총 환불 금액",
    width: tableWidth.totalRefundAmount,
    value: "totalRefundAmount",
  },

  {
    id: 15,
    label: "구매자 아이디",
    width: tableWidth.userEmail,
    value: "userEmail",
  },
  {
    id: 16,
    label: "구매자 전화번호",
    width: tableWidth.userPhoneNumber,
    value: "userPhoneNumber",
  },
  {
    id: 17,
    label: "수취인",
    width: tableWidth.recipientName,
    value: "recipientName",
  },
  {
    id: 18,
    label: "수취인 전화번호",
    width: tableWidth.recipientPhoneNumber,
    value: "recipientPhoneNumber",
  },
  {
    id: 19,
    label: "취소 거절일",
    width: tableWidth.rejectCancelDay,
    value: "rejectCancelDay",
  },
  {
    id: 20,
    label: "거절대표사유",
    width: tableWidth.rejectReason,
    value: "rejectReason",
  },
  {
    id: 21,
    label: "거절상세사유",
    width: tableWidth.detailRejectReason,
    value: "detailRejectReason",
  },
];
