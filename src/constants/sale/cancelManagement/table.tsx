import { getAverageWidth } from "@utils/calculator";

export const tableWidth = {
  index: 1182,
  left: 612,
  right: 2600,

  //체크박스
  checkBox: 36,

  // 주문번호
  merchantitemUid: 128,

  // 상품 주문번호
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
  paymentDay: 128,

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
  quantity: 64,

  //상품가
  price: 64,

  //옵션가
  optionPrice: 64,

  //상품별 총 금액
  totalPrice: 136,

  // 배송비
  shipmentPrice: 64,

  // 제주/도서 추가배송비
  shipmentDistantPrice: 136,

  // 총 환불 금액
  totalRefundPrice: 136,

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
    width: getAverageWidth(tableWidth.checkBox, tableWidth.left),
    value: "checkBox",
  },
  {
    id: 1,
    label: "주문번호",
    width: getAverageWidth(tableWidth.merchantitemUid, tableWidth.left),
    value: "merchantitemUid",
  },
  {
    id: 2,
    label: "상품 주문번호",
    width: getAverageWidth(tableWidth.productCode, tableWidth.left),
    value: "productCode",
  },
  {
    id: 3,
    label: "주문 상품",
    width: getAverageWidth(tableWidth.orderProduct, tableWidth.left),
    value: "orderProduct",
  },
  {
    id: 4,
    label: "구매자 명",
    width: getAverageWidth(tableWidth.userName, tableWidth.left),
    value: "userName",
  },
  {
    id: 5,
    label: "주문 상태",
    width: getAverageWidth(tableWidth.orderStatus, tableWidth.left),
    value: "orderStatus",
  },
];

export const scrollTableType = [
  {
    id: 0,
    label: "클래임 상태",
    width: getAverageWidth(tableWidth.claimStatus, tableWidth.right),
    value: "claimStatus",
  },
  {
    id: 1,
    label: "결제일",
    width: getAverageWidth(tableWidth.paymentDay, tableWidth.right),
    value: "paymentDay",
  },
  {
    id: 2,
    label: "취소요청일",
    width: getAverageWidth(tableWidth.requestCancelDay, tableWidth.right),
    value: "requestCancelDay",
  },
  {
    id: 3,
    label: "대표사유",
    width: getAverageWidth(tableWidth.reason, tableWidth.right),
    value: "reason",
  },
  {
    id: 4,
    label: "상세사유",
    width: getAverageWidth(tableWidth.detailReason, tableWidth.right),
    value: "detailReason",
  },
  {
    id: 5,
    label: "취소 완료일",
    width: getAverageWidth(tableWidth.cancelCompletedDay, tableWidth.right),
    value: "cancelCompletedDay",
  },
  {
    id: 6,
    label: "옵션",
    width: getAverageWidth(tableWidth.option, tableWidth.right),
    value: "option",
  },
  {
    id: 7,
    label: "상품개수",
    width: getAverageWidth(tableWidth.quantity, tableWidth.right),
    value: "quantity",
  },
  {
    id: 8,
    label: "상품가",
    width: getAverageWidth(tableWidth.price, tableWidth.right),
    value: "price",
  },
  {
    id: 9,
    label: "옵션가",
    width: getAverageWidth(tableWidth.optionPrice, tableWidth.right),
    value: "optionPrice",
  },
  {
    id: 10,
    label: "상품별 총 금액",
    width: getAverageWidth(tableWidth.totalPrice, tableWidth.right),
    value: "totalPrice",
  },
  {
    id: 11,
    label: "배송비",
    width: getAverageWidth(tableWidth.shipmentPrice, tableWidth.right),
    value: "shipmentPrice",
  },
  {
    id: 12,
    label: "제주/도서 추가배송비",
    width: getAverageWidth(tableWidth.shipmentDistantPrice, tableWidth.right),
    value: "shipmentDistantPrice",
  },
  {
    id: 13,
    label: "총 환불 금액",
    width: getAverageWidth(tableWidth.totalRefundPrice, tableWidth.right),
    value: "totalRefundPrice",
  },
  {
    id: 14,
    label: "구매자 아이디",
    width: getAverageWidth(tableWidth.userEmail, tableWidth.right),
    value: "userEmail",
  },
  {
    id: 15,
    label: "구매자 전화번호",
    width: getAverageWidth(tableWidth.userPhoneNumber, tableWidth.right),
    value: "userPhoneNumber",
  },
  {
    id: 16,
    label: "수취인",
    width: getAverageWidth(tableWidth.recipientName, tableWidth.right),
    value: "recipientName",
  },
  {
    id: 17,
    label: "수취인 전화번호",
    width: getAverageWidth(tableWidth.recipientPhoneNumber, tableWidth.right),
    value: "recipientPhoneNumber",
  },
  {
    id: 18,
    label: "취소 거절일",
    width: getAverageWidth(tableWidth.rejectCancelDay, tableWidth.right),
    value: "rejectCancelDay",
  },
  {
    id: 19,
    label: "거절대표사유",
    width: getAverageWidth(tableWidth.rejectReason, tableWidth.right),
    value: "rejectReason",
  },
  {
    id: 20,
    label: "거절상세사유",
    width: getAverageWidth(tableWidth.detailRejectReason, tableWidth.right),
    value: "detailRejectReason",
  },
];
