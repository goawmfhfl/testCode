export const ORDER_MANAGEMENT = "주문관리";
export const PAYMENT_DAY = "결제일";
export const ORDER_PRODUCT = "주문 상품";

export const controllerType = {
  CONFIRM_ORDER: "주문 확인",
  SHIPMENT_PROCESSING: "발송 처리",
  CANCEL_ORDER: "주문 취소",
  RETURN_PROCESSING: "반품 처리",
  EXCHANGE_PRODCESSING: "교환 처리",
};

export const orderCodeType = {
  MERCHANTITEM_UID: "주문번호",
  PRODUCT_CODE: "상품 주문번호",
};

export const shipmentType = {
  COURIER: "택배사",
  INVOICE_NUMBER: "운송장번호",
  SHIPMENT_PRICE: "배송비",
  ADDITIONAL_SHIPMENT_PRICE: "제주/도서 추가배송비",
};

export const orderStatusType = {
  ORDER: "주문 상태",
  CLAIM: "클레임 상태",
};

export const recipientType = {
  NAME: "수취인",
  PHONE_NUMBER: "수취인 전화번호",
  ADDRESS: "수취인 주소",
  POST_CODE: "우편 번호",
  SHIPMENT_MEMO: "배송 메세지",
};

export const sellerType = {
  ID: "구매자 아이디",
  NAME: "구매자명",
  PHONE_NUMBER: "구매자 전화번호",
};

export const optionType = {
  OPTION: "옵션",
  QUANTITY: "상품개수",
  PRICE: "상품가",
  OPTION_PRICE: "옵션가",
  TOTAL_PRICE: "상품별 총금액",
};
