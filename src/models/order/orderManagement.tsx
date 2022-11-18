import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";

export interface SearchQueryCacheType {
  id: number;
  label: string;
  value: string;
}

export interface NormalizedListType {
  orders: {
    allIds: Array<number>;
    byId: { [key: number]: OrderItemsType };
  };
}

// need Change Type
export interface caculatedOrderItemType {
  orderId: number;
  paymentDay: string;
  merchantitemUid: string;
  productCode: string;
  orderProduct: string;
  quantity: number;
  price: number;
  option: string;
  optionPrice: string;
  totalPrice: string;
  courier: string;
  invoiceNumber: string;
  shipmentPrice: number;
  shipmentDistantPrice: string;
  orderState: string;
  claimState: string;
  recipientName: string;
  recipientPhoneNumber: string;
  address: string;
  postCode: number;
  shipmentMemo: string;
  sellerId: string;
  sellerName: string;
  sellerPhoneNumber: string;
}
