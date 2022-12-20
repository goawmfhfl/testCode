import { getAverageWidth } from "@utils/calculator";

export const tableWidth = {
  index: 1182,
  left: 612,
  right: 4032,

  // 체크박스
  checkbox: 36,

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

  // 교환요청일
  requestExchangeDay: 128,

  // 대표사유
  mainReason: 180,

  // 상세사유
  detaildReason: 200,

  // 첨부사진
  AttachedImg: 160,

  // 교환 완료일
  completedExchangeDay: 128,

  // 원배송 택배사
  shipmentCompany: 136,

  // 원배송 송장번호
  shipmentNumber: 216,

  // 수거배송 택배사
  exchangeShipmentCompany: 136,

  // 수거배송 송장번호
  exchangeShipmentNumber: 216,

  // 재배송 택배사
  shippingAgainShipmentCompany: 136,

  // 재배송 송장번호
  shippingAgainShipmentNumber: 216,

  // 옵션
  option: 136,

  // 상품개수
  quantity: 64,

  // 상품가
  price: 64,

  // 옵션가
  optionPrice: 64,

  // 상품별 총 금액
  totalPrice: 136,

  // 배송비
  shipmentPrice: 64,

  // 제주/도서 추가배송비
  shipmentDistantPrice: 136,

  // 총 환불 금액
  totalExchangePrice: 136,

  // 구매자 아이디
  userEmail: 144,

  // 구매자 전화번호
  userPhoneNumber: 112,

  // 수취인
  recipientName: 64,

  // 수취인 전화번호
  recipientPhoneNumber: 112,

  // 교환 수거지
  exchangeAddress: 112,

  // 우편번호
  postCode: 64,

  // 재배송지
  shippingAgainExchangeAddress: 112,

  // 우편번호
  shippingAgainPostCode: 64,

  // 교환거절일
  rejectExchangeDay: 128,

  // 거절대표사유
  rejectMainReason: 180,

  // 거절상세사유
  rejectDetaildReason: 200,
};

export const fixTableType = [
  {
    id: 0,
    label: "checkBox",
    width: getAverageWidth(tableWidth.checkbox, tableWidth.left),
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
    label: "클레임 상태",
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
    label: "교환요청일",
    width: getAverageWidth(tableWidth.requestExchangeDay, tableWidth.right),
    value: "requestExchangeDay",
  },
  {
    id: 3,
    label: "대표사유",
    width: getAverageWidth(tableWidth.mainReason, tableWidth.right),
    value: "mainReason",
  },
  {
    id: 4,
    label: "상세사유",
    width: getAverageWidth(tableWidth.detaildReason, tableWidth.right),
    value: "detaildReason",
  },
  {
    id: 5,
    label: "첨부사진",
    width: getAverageWidth(tableWidth.AttachedImg, tableWidth.right),
    value: "AttachedImg",
  },
  {
    id: 6,
    label: "교환 완료일",
    width: getAverageWidth(tableWidth.completedExchangeDay, tableWidth.right),
    value: "completedExchangeDay",
  },
  {
    id: 7,
    label: "원배송 택배사",
    width: getAverageWidth(tableWidth.shipmentCompany, tableWidth.right),
    value: "shipmentCompany",
  },
  {
    id: 8,
    label: "원배송 송장번호",
    width: getAverageWidth(tableWidth.shipmentNumber, tableWidth.right),
    value: "shipmentNumber",
  },
  {
    id: 9,
    label: "수거배송 택배사",
    width: getAverageWidth(
      tableWidth.exchangeShipmentCompany,
      tableWidth.right
    ),
    value: "exchangeShipmentCompany",
  },
  {
    id: 10,
    label: "수거배송 송장번호",
    width: getAverageWidth(tableWidth.exchangeShipmentNumber, tableWidth.right),
    value: "exchangeShipmentNumber",
  },
  {
    id: 11,
    label: "재배송 택배사",
    width: getAverageWidth(
      tableWidth.shippingAgainShipmentCompany,
      tableWidth.right
    ),
    value: "exchangeShipmentCompany",
  },
  {
    id: 12,
    label: "재배송 송장번호",
    width: getAverageWidth(
      tableWidth.shippingAgainShipmentNumber,
      tableWidth.right
    ),
    value: "exchangeShipmentNumber",
  },
  {
    id: 13,
    label: "옵션",
    width: getAverageWidth(tableWidth.option, tableWidth.right),
    value: "option",
  },
  {
    id: 14,
    label: "상품개수",
    width: getAverageWidth(tableWidth.quantity, tableWidth.right),
    value: "quantity",
  },
  {
    id: 15,
    label: "상품가",
    width: getAverageWidth(tableWidth.price, tableWidth.right),
    value: "price",
  },
  {
    id: 16,
    label: "옵션가",
    width: getAverageWidth(tableWidth.optionPrice, tableWidth.right),
    value: "optionPrice",
  },
  {
    id: 17,
    label: "상품별 총 금액",
    width: getAverageWidth(tableWidth.totalPrice, tableWidth.right),
    value: "totalPrice",
  },
  {
    id: 18,
    label: "배송비",
    width: getAverageWidth(tableWidth.shipmentPrice, tableWidth.right),
    value: "shipmentPrice",
  },
  {
    id: 19,
    label: "제주/도서 추가배송비",
    width: getAverageWidth(tableWidth.shipmentDistantPrice, tableWidth.right),
    value: "shipmentDistantPrice",
  },
  {
    id: 20,
    label: "총 환불 금액",
    width: getAverageWidth(tableWidth.totalExchangePrice, tableWidth.right),
    value: "totalExchangePrice",
  },
  {
    id: 21,
    label: "구매자 아이디",
    width: getAverageWidth(tableWidth.userName, tableWidth.right),
    value: "userName",
  },
  {
    id: 22,
    label: "구매자 전화번호",
    width: getAverageWidth(tableWidth.userPhoneNumber, tableWidth.right),
    value: "userPhoneNumber",
  },
  {
    id: 23,
    label: "수취인",
    width: getAverageWidth(tableWidth.recipientName, tableWidth.right),
    value: "recipientName",
  },
  {
    id: 24,
    label: "수취인 전화번호",
    width: getAverageWidth(tableWidth.recipientPhoneNumber, tableWidth.right),
    value: "recipientPhoneNumber",
  },
  {
    id: 25,
    label: "교환 수거지",
    width: getAverageWidth(tableWidth.exchangeAddress, tableWidth.right),
    value: "exchangeAddress",
  },
  {
    id: 26,
    label: "우편번호",
    width: getAverageWidth(tableWidth.postCode, tableWidth.right),
    value: "postCode",
  },
  {
    id: 27,
    label: "재배송지",
    width: getAverageWidth(
      tableWidth.shippingAgainExchangeAddress,
      tableWidth.right
    ),
    value: "shippingAgainExchangeAddress",
  },
  {
    id: 28,
    label: "우편번호",
    width: getAverageWidth(tableWidth.shippingAgainPostCode, tableWidth.right),
    value: "shippingAgainPostCode",
  },
  {
    id: 29,
    label: "교환거절일",
    width: getAverageWidth(tableWidth.rejectExchangeDay, tableWidth.right),
    value: "rejectExchangeDay",
  },
  {
    id: 30,
    label: "거절대표사유",
    width: getAverageWidth(tableWidth.rejectMainReason, tableWidth.right),
    value: "rejectMainReason",
  },
  {
    id: 31,
    label: "거절상세사유",
    width: getAverageWidth(tableWidth.rejectDetaildReason, tableWidth.right),
    value: "rejectDetaildReason",
  },
];
