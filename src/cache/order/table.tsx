import {
  orderCodeType,
  orderProductType,
  orderStatusType,
  PAYMENT_DAY,
  recipientType,
  sellerType,
  shipmentType,
  tableWidth,
} from "@constants/order/orderManagement";

export const fixedTableData = [
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

export const scrollTableData = [
  {
    id: 0,
    label: orderStatusType.CLAIM,
    width: Math.round((tableWidth.checkbox / tableWidth.left) * 100),
    className: "order_status_claim",
  },
  {
    id: 1,
    label: shipmentType.COURIER,
    width: Math.round(
      (tableWidth.orderCodeType.PRODUCT_CODE / tableWidth.left) * 100
    ),
    className: "order_courier",
  },
  {
    id: 2,
    label: shipmentType.INVOICE_NUMBER,
    width: Math.round(
      (tableWidth.orderCodeType.MERCHANTITEM_UID / tableWidth.left) * 100
    ),
    className: "order_invoice_number",
  },
  {
    id: 3,
    label: PAYMENT_DAY,
    width: Math.round((tableWidth.PAYMENT_DAY / tableWidth.left) * 100),
    className: "order_payment_day",
  },
  {
    id: 4,
    label: recipientType.NAME,
    width: Math.round((tableWidth.sellerType.NAME / tableWidth.left) * 100),
    className: "order_recipient_name",
  },
  {
    id: 5,
    label: recipientType.PHONE_NUMBER,
    width: Math.round(
      (tableWidth.orderStatusType.ORDER / tableWidth.left) * 100
    ),
    className: "order_recipient_phone_number",
  },
  {
    id: 6,
    label: recipientType.POST_CODE,
    width: Math.round((tableWidth.checkbox / tableWidth.left) * 100),
    className: "order_recipient_post_code",
  },
  {
    id: 7,
    label: recipientType.SHIPMENT_MEMO,
    width: Math.round(
      (tableWidth.orderCodeType.PRODUCT_CODE / tableWidth.left) * 100
    ),
    className: "order_recipient_shipment_memo",
  },
  {
    id: 8,
    label: sellerType.ID,
    width: Math.round(
      (tableWidth.orderCodeType.MERCHANTITEM_UID / tableWidth.left) * 100
    ),
    className: "order_seller_id",
  },
  {
    id: 9,
    label: sellerType.PHONE_NUMBER,
    width: Math.round(
      (tableWidth.sellerType.PHONE_NUMBER / tableWidth.left) * 100
    ),
    className: "order_seller_phone_number",
  },
  {
    id: 10,
    label: orderProductType.OPTION,
    width: Math.round((tableWidth.sellerType.NAME / tableWidth.left) * 100),
    className: "order_option",
  },
  {
    id: 11,
    label: orderProductType.QUANTITY,
    width: Math.round(
      (tableWidth.orderStatusType.ORDER / tableWidth.left) * 100
    ),
    className: "order_option_quantity",
  },
  {
    id: 12,
    label: orderProductType.PRICE,
    width: Math.round((tableWidth.checkbox / tableWidth.left) * 100),
    className: "order_price",
  },
  {
    id: 13,
    label: orderProductType.OPTION_PRICE,
    width: Math.round(
      (tableWidth.orderCodeType.PRODUCT_CODE / tableWidth.left) * 100
    ),
    className: "order_option_price",
  },
  {
    id: 14,
    label: orderProductType.TOTAL_PRICE,
    width: Math.round(
      (tableWidth.orderProductType.TOTAL_PRICE / tableWidth.left) * 100
    ),
    className: "order_total_price",
  },
  {
    id: 15,
    label: shipmentType.SHIPMENT_PRICE,
    width: Math.round(
      (tableWidth.shipmentType.SHIPMENT_PRICE / tableWidth.left) * 100
    ),
    className: "order_shipment_price",
  },
  {
    id: 16,
    label: shipmentType.ADDITIONAL_SHIPMENT_PRICE,
    width: Math.round(
      (tableWidth.shipmentType.ADDITIONAL_SHIPMENT_PRICE / tableWidth.left) *
        100
    ),
    className: "order_shipment_addtional_price",
  },
];
