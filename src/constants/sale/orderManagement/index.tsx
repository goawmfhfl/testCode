export enum OrderStatusType {
  NEW = "NEW",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  SHIPPING_COMPLETED = "SHIPPING_COMPLETED",
}

export const optionListType: Array<{
  id: number;
  label: string;
  value: string;
}> = [
  { id: 0, label: "구매 의사 취소", value: "consumer" },
  { id: 1, label: "색상 및 사이즈 변경", value: "consumer" },
  { id: 2, label: "다른 상품 잘못 주문", value: "consumer" },
  { id: 3, label: "배송 지연", value: "seller" },
  { id: 4, label: "배송 누락", value: "seller" },
  { id: 5, label: "상품 품절", value: "seller" },
  { id: 6, label: "상품 파손", value: "seller" },
  { id: 7, label: "상품 정보 상이", value: "seller" },
  { id: 8, label: "오배송", value: "seller" },
];
