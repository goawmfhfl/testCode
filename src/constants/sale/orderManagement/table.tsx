import { getAverageWidth } from "@utils/calculator";

export const tableWidth = {
  index: 1182,
  left: 612,
  right: 1920,

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

  // 택배사
  courier: 120,

  // 운송장 번호
  invoiceNumber: 216,

  // 결제일
  paymentDay: 128,

  // 수취인
  recipientName: 64,

  // 수취인 전화번호
  recipientPhoneNumber: 112,

  // 수취인 주소
  recipientAddress: 112,

  // 우편번호
  postCode: 64,

  // 배송메세지
  shipmentMemo: 88,

  // 구매자 아이디
  userEmail: 144,

  // 구매자 전화번호
  userPhoneNumber: 144,

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
    label: "택배사",
    width: getAverageWidth(tableWidth.courier, tableWidth.right),
    value: "courier",
  },
  {
    id: 2,
    label: "운송장 번호",
    width: getAverageWidth(tableWidth.invoiceNumber, tableWidth.right),
    value: "invoiceNumber",
  },
  {
    id: 3,
    label: "결제일",
    width: getAverageWidth(tableWidth.paymentDay, tableWidth.right),
    value: "paymentDay",
  },
  {
    id: 4,
    label: "수취인",
    width: getAverageWidth(tableWidth.recipientName, tableWidth.right),
    value: "paymentDay",
  },
  {
    id: 5,
    label: "수취인 전화번호",
    width: getAverageWidth(tableWidth.recipientPhoneNumber, tableWidth.right),
    value: "recipientPhoneNumber",
  },
  {
    id: 6,
    label: "수취인 주소",
    width: getAverageWidth(tableWidth.recipientAddress, tableWidth.right),
    value: "recipientAddress",
  },
  {
    id: 7,
    label: "우편번호",
    width: getAverageWidth(tableWidth.postCode, tableWidth.right),
    value: "postCode",
  },
  {
    id: 8,
    label: "배송메세지",
    width: getAverageWidth(tableWidth.shipmentMemo, tableWidth.right),
    value: "shipmentMemo",
  },
  {
    id: 9,
    label: "구매자아이디",
    width: getAverageWidth(tableWidth.userEmail, tableWidth.right),
    value: "userEmail",
  },
  {
    id: 10,
    label: "구매자 전화번호",
    width: getAverageWidth(tableWidth.userPhoneNumber, tableWidth.right),
    value: "userPhoneNumber",
  },
  {
    id: 11,
    label: "옵션",
    width: getAverageWidth(tableWidth.option, tableWidth.right),
    value: "option",
  },
  {
    id: 12,
    label: "상품개수",
    width: getAverageWidth(tableWidth.quantity, tableWidth.right),
    value: "quantity",
  },
  {
    id: 13,
    label: "상품가",
    width: getAverageWidth(tableWidth.price, tableWidth.right),
    value: "price",
  },
  {
    id: 14,
    label: "옵션가",
    width: getAverageWidth(tableWidth.optionPrice, tableWidth.right),
    value: "optionPrice",
  },
  {
    id: 15,
    label: "상품별 총 금액",
    width: getAverageWidth(tableWidth.totalPrice, tableWidth.right),
    value: "totalPrice",
  },
  {
    id: 16,
    label: "배송비",
    width: getAverageWidth(tableWidth.shipmentPrice, tableWidth.right),
    value: "shipmentPrice",
  },
  {
    id: 17,
    label: "제주/도서 추가배송비",
    width: getAverageWidth(tableWidth.shipmentDistantPrice, tableWidth.right),
    value: "shipmentDistantPrice",
  },
];
