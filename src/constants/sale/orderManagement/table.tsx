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
  userPhoneNumber: 112,

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
    label: "상품가",
    width: tableWidth.price,
    value: "price",
  },
  {
    id: 14,
    label: "옵션가",
    width: tableWidth.optionPrice,
    value: "optionPrice",
  },
  {
    id: 15,
    label: "상품별 총 금액",
    width: tableWidth.totalPrice,
    value: "totalPrice",
  },
  {
    id: 16,
    label: "배송비",
    width: tableWidth.shipmentPrice,
    value: "shipmentPrice",
  },
  {
    id: 17,
    label: "제주/도서 추가배송비",
    width: tableWidth.shipmentDistantPrice,
    value: "shipmentDistantPrice",
  },
];
