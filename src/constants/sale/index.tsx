export const SEND_EXCEL = "내보내기";
export const SEND_ALL_EXCEL = "전체 내역 내보내기";

export enum SaleMenuStatusType {
  ORDER = "ORDER",
  CANCEL = "CANCEL",
  EXCHANGE = "EXCHANGE",
  REFUND = "REFUND",
}

export const claimStatusType = {
  CONFIRM_PURCHASE: "구매 확인",
  CANCEL_REQUEST: "취소 요청",
  CANCEL_REFUSAL: "취소 거절",
  CANCEL_COMPLETED: "취소 완료",
  REFUND_REQUEST: "환불 요청",
  REFUND_REFUSAL: "환불 거절",
  REFUND_COMPLETED: "환불 완료",
  REFUND_PICK_UP_ING: "환불 수거 진행중",
  REFUND_PICK_UP_COMPLETED: "환불 수거 완료",
  EXCHANGE_REQUEST: "교환 요청",
  EXCHANGE_REFUSAL: "교환 거부",
  EXCHANGE_COMPLETED: "교환 완료",
  EXCHANGE_PICK_UP_ING: "교환 수거 진행중",
  EXCHANGE_PICK_UP_COMPLETED: "교환 수거 완료",
  EXCHANGE_ING: "교환중",
};
