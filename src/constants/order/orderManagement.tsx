export const tableWidth = {
  index: 1182,
  left: 612,
  right: 1920,

  checkbox: 36,

  PAYMENT_DAY: 128,

  orderCodeType: {
    MERCHANTITEM_UID: 128,
    PRODUCT_CODE: 128,
  },

  orderProductType: {
    ORDER_PRODUCT: 160,
    OPTION: 136,
    QUANTITY: 64,
    PRICE: 64,
    OPTION_PRICE: 64,
    TOTAL_PRICE: 136,
  },

  shipmentType: {
    COURIER: 120,
    INVOICE_NUMBER: 216,
    SHIPMENT_PRICE: 64,
    SHIPMENT_DISTANT_PRICE: 200,
  },

  orderStatusType: {
    ORDER: 80,
    CLAIM: 96,
  },

  recipientType: {
    NAME: 64,
    PHONE_NUMBER: 112,
    ADDRESS: 112,
    POST_CODE: 64,
    SHIPMENT_MEMO: 88,
  },

  sellerType: {
    ID: 144,
    NAME: 80,
    PHONE_NUMBER: 144,
  },
};

export const controllerType = {
  CONFIRM_ORDER: "주문 확인",
  SHIPMENT_PROCESSING: "발송 처리",
  CANCEL_ORDER: "주문 취소",
  RETURN_PROCESSING: "반품 처리",
  EXCHANGE_PRODCESSING: "교환 처리",
};

export const ORDER_MANAGEMENT = "주문관리";
export const PAYMENT_DAY = "결제일";

export const orderCodeType = {
  MERCHANTITEM_UID: "주문번호",
  PRODUCT_CODE: "상품 주문번호",
};

export const orderProductType = {
  ORDER_PRODUCT: "주문 상품",
  QUANTITY: "상품개수",
  PRICE: "상품가",
  OPTION: "옵션",
  OPTION_PRICE: "옵션가",
  TOTAL_PRICE: "상품별 총금액",
};

export const shipmentType = {
  COURIER: "택배사",
  INVOICE_NUMBER: "운송장번호",
  SHIPMENT_PRICE: "배송비",
  SHIPMENT_DISTANT_PRICE: "제주/도서 추가배송비",
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

export const fixedTableType = [
  {
    id: 0,
    label: "checkBox",
    width: Math.round((tableWidth.checkbox / tableWidth.left) * 100),
    className: "checkBox",
  },
  {
    id: 1,
    label: orderCodeType.PRODUCT_CODE,
    width: Math.round(
      (tableWidth.orderCodeType.PRODUCT_CODE / tableWidth.left) * 100
    ),
    className: "order_product_code",
  },
  {
    id: 2,
    label: orderCodeType.MERCHANTITEM_UID,
    width: Math.round(
      (tableWidth.orderCodeType.MERCHANTITEM_UID / tableWidth.left) * 100
    ),
    className: "name",
  },
  {
    id: 3,
    label: orderProductType.ORDER_PRODUCT,
    width: Math.round(
      (tableWidth.orderProductType.ORDER_PRODUCT / tableWidth.left) * 100
    ),
    className: "order_product",
  },
  {
    id: 4,
    label: sellerType.NAME,
    width: Math.round((tableWidth.sellerType.NAME / tableWidth.left) * 100),
    className: "order_seller_name",
  },
  {
    id: 5,
    label: orderStatusType.ORDER,
    width: Math.round(
      (tableWidth.orderStatusType.ORDER / tableWidth.left) * 100
    ),
    className: "order_status_order",
  },
];

export const scrollTableType = [
  {
    id: 0,
    label: orderStatusType.CLAIM,
    width: Math.round(
      (tableWidth.orderStatusType.CLAIM / tableWidth.right) * 100
    ),
    className: "order_status_claim",
  },
  {
    id: 1,
    label: shipmentType.COURIER,
    width: Math.round(
      (tableWidth.orderCodeType.PRODUCT_CODE / tableWidth.right) * 100
    ),
    className: "order_courier",
  },
  {
    id: 2,
    label: shipmentType.INVOICE_NUMBER,
    width: Math.round(
      (tableWidth.orderCodeType.MERCHANTITEM_UID / tableWidth.right) * 100
    ),
    className: "order_invoice_number",
  },
  {
    id: 3,
    label: PAYMENT_DAY,
    width: Math.round((tableWidth.PAYMENT_DAY / tableWidth.right) * 100),
    className: "order_payment_day",
  },
  {
    id: 4,
    label: recipientType.NAME,
    width: Math.round((tableWidth.sellerType.NAME / tableWidth.right) * 100),
    className: "order_recipient_name",
  },
  {
    id: 5,
    label: recipientType.PHONE_NUMBER,
    width: Math.round(
      (tableWidth.recipientType.PHONE_NUMBER / tableWidth.right) * 100
    ),
    className: "order_recipient_phone_number",
  },
  {
    id: 6,
    label: recipientType.ADDRESS,
    width: Math.round(
      (tableWidth.recipientType.ADDRESS / tableWidth.right) * 100
    ),
    className: "order_recipient_address",
  },
  {
    id: 7,
    label: recipientType.POST_CODE,
    width: Math.round(
      (tableWidth.recipientType.POST_CODE / tableWidth.right) * 100
    ),
    className: "order_recipient_post_code",
  },
  {
    id: 8,
    label: recipientType.SHIPMENT_MEMO,
    width: Math.round(
      (tableWidth.recipientType.SHIPMENT_MEMO / tableWidth.right) * 100
    ),
    className: "order_shipment-memo",
  },
  {
    id: 9,
    label: sellerType.ID,
    width: Math.round((tableWidth.sellerType.ID / tableWidth.right) * 100),
    className: "order_seller_id",
  },
  {
    id: 10,
    label: sellerType.PHONE_NUMBER,
    width: Math.round(
      (tableWidth.sellerType.PHONE_NUMBER / tableWidth.right) * 100
    ),
    className: "order_seller_phone_number",
  },
  {
    id: 11,
    label: orderProductType.OPTION,
    width: Math.round((tableWidth.sellerType.NAME / tableWidth.right) * 100),
    className: "order_option",
  },
  {
    id: 12,
    label: orderProductType.QUANTITY,
    width: Math.round(
      (tableWidth.orderStatusType.ORDER / tableWidth.right) * 100
    ),
    className: "order_option_quantity",
  },
  {
    id: 13,
    label: orderProductType.PRICE,
    width: Math.round(
      (tableWidth.orderProductType.PRICE / tableWidth.right) * 100
    ),
    className: "order_price",
  },
  {
    id: 14,
    label: orderProductType.OPTION_PRICE,
    width: Math.round(
      (tableWidth.orderProductType.OPTION_PRICE / tableWidth.right) * 100
    ),
    className: "order_option_price",
  },
  {
    id: 15,
    label: orderProductType.TOTAL_PRICE,
    width: Math.round(
      (tableWidth.orderProductType.TOTAL_PRICE / tableWidth.right) * 100
    ),
    className: "order_total_price",
  },
  {
    id: 16,
    label: shipmentType.SHIPMENT_PRICE,
    width: Math.round(
      (tableWidth.shipmentType.SHIPMENT_PRICE / tableWidth.right) * 100
    ),
    className: "order_shipment_price",
  },
  {
    id: 17,
    label: shipmentType.SHIPMENT_DISTANT_PRICE,
    width: Math.round(
      (tableWidth.shipmentType.SHIPMENT_DISTANT_PRICE / tableWidth.right) * 100
    ),
    className: "order_shipment_addtional_price",
  },
];
