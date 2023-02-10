import { SearchQueryType } from "@models/sale";

export enum DenyRefundOrExchangeRequestType {
  REFUND = "REFUND",
  EXCHANGE = "EXCHANGE",
}

export enum SendType {
  SEND = "SEND",
  REFUND_PICK_UP = "REFUND_PICK_UP",
  EXCHANGE_PICK_UP = "EXCHANGE_PICK_UP",
  EXCHANGE_RESEND = "EXCHANGE_RESEND",
}

export enum OrderSearchType {
  RECIPIENT_NAME = "RECIPIENT_NAME",
  RECIPIENT_PHONE_NUMBER = "RECIPIENT_PHONE_NUMBER",
  MERCHANT_UID = "MERCHANT_UID",
}

export const searchQueryType: Array<SearchQueryType> = [
  { id: 0, label: "구매자명", value: OrderSearchType.RECIPIENT_NAME },
  {
    id: 1,
    label: "구매자 전화번호",
    value: OrderSearchType.RECIPIENT_PHONE_NUMBER,
  },
  { id: 2, label: "주문번호", value: OrderSearchType.MERCHANT_UID },
];

export enum MenuStatusType {
  PRODUCT = "PRODUCT",
  SALE = "SALE",
  INQUIRY = "INQUIRY",
  SETTLEMENT = "SETTLEMENT",
  SHOP = "SHOP",
  NOTICE = "NOTICE",
}

export enum SaleMenuStatusType {
  ORDER = "ORDER",
  CANCEL = "CANCEL",
  EXCHANGE = "EXCHANGE",
  REFUND = "REFUND",
}

export enum OrderStatusGroup {
  ORDER = "ORDER",
  CANCEL = "CANCEL",
  REFUND = "REFUND",
  EXCHANGE = "EXCHANGE",
}

export enum OrderStatusType {
  ORDER = "ORDER",
  CLAIM = "CLAIM",
}
export enum Cause {
  DEFAULT = "DEFAULT",
  CLIENT = "CLIENT",
  SELLER = "SELLER",
}

export enum ShipmentType {
  FREE = "FREE",
  CHARGE = "CHARGE",
  CONDITIONAL_FREE = "CONDITIONAL_FREE",
}

export enum OrderStatusName {
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  SHIPPING_COMPLETED = "SHIPPING_COMPLETED",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  CANCEL_ERROR = "CANCEL_ERROR",
  CANCEL_REFUSAL = "CANCEL_REFUSAL",
  REFUND_REQUEST = "REFUND_REQUEST",
  REFUND_PICK_UP_IN_PROGRESS = "REFUND_PICK_UP_IN_PROGRESS",
  REFUND_PICK_UP_COMPLETED = "REFUND_PICK_UP_COMPLETED",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_REFUSAL = "REFUND_REFUSAL",
  REFUND_ERROR = "REFUND_ERROR",
  EXCHANGE_REQUEST = "EXCHANGE_REQUEST",
  EXCHANGE_PICK_UP_IN_PROGRESS = "EXCHANGE_PICK_UP_IN_PROGRESS",
  EXCHANGE_PICK_UP_COMPLETED = "EXCHANGE_PICK_UP_COMPLETED",
  SHIPPING_AGAIN = "SHIPPING_AGAIN",
  EXCHANGE_COMPLETED = "EXCHANGE_COMPLETED",
  EXCHANGE_REFUSAL = "EXCHANGE_REFUSAL",
  EXCHANGE_ERROR = "EXCHANGE_ERROR",
  CONFIRM_PURCHASE = "CONFIRM_PURCHASE",
}

export const orderStatusNameType = {
  PAYMENT_COMPLETED: "새주문",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  SHIPPING_COMPLETED: "배송 완료",
  CANCEL_REQUEST: "취소 요청",
  CANCEL_COMPLETED: "취소 완료",
  CANCEL_ERROR: "취소 오류",
  CANCEL_REFUSAL: "취소 거절",
  REFUND_REQUEST: "반품 요청",
  REFUND_PICK_UP_IN_PROGRESS: "수거중",
  REFUND_PICK_UP_COMPLETED: "수거완료",
  REFUND_COMPLETED: "반품 완료",
  REFUND_REFUSAL: "반품 거절",
  REFUND_ERROR: "반품 오류",
  EXCHANGE_REQUEST: "교환 요청",
  EXCHANGE_PICK_UP_IN_PROGRESS: "수거중",
  EXCHANGE_PICK_UP_COMPLETED: "수거 완료",
  SHIPPING_AGAIN: "재배송",
  EXCHANGE_COMPLETED: "교환 완료",
  EXCHANGE_REFUSAL: "교환 거절",
  EXCHANGE_ERROR: "교환 오류",
  CONFIRM_PURCHASE: "주문 승인",
  PICK_UP_IN_PROGRESS: "수거중",
  PICK_UP_COMPLETED: "수거 완료",
};

export enum OrderStatus {
  NEW = "NEW",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  SHIPPING_COMPLETED = "SHIPPING_COMPLETED",
  CONFIRM_PURCHASE = "CONFIRM_PURCHASE",
  CANCEL_REQUEST = "CANCEL_REQUEST",
  CANCEL_REFUSAL = "CANCEL_REFUSAL",
  CANCEL_COMPLETED = "CANCEL_COMPLETED",
  REFUND_REQUEST = "REFUND_REQUEST",
  REFUND_REFUSAL = "REFUND_REFUSAL",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REFUND_ERROR = "REFUND_ERROR",
  REFUND_PICK_UP_ING = "REFUND_PICK_UP_ING",
  REFUND_PICK_UP_COMPLETED = "REFUND_PICK_UP_COMPLETED",
  EXCHANGE_REQUEST = "EXCHANGE_REQUEST",
  EXCHANGE_REFUSAL = "EXCHANGE_REFUSAL",
  EXCHANGE_COMPLETED = "EXCHANGE_COMPLETED",
  EXCHANGE_PICK_UP_ING = "EXCHANGE_PICK_UP_ING",
  EXCHANGE_PICK_UP_COMPLETED = "EXCHANGE_PICK_UP_COMPLETED",
  EXCHANGE_ING = "EXCHANGE_ING",
}

export const claimStatusType = {
  CONFIRM_PURCHASE: "구매 확인",
  CANCEL_REQUEST: "취소 요청",
  CANCEL_REFUSAL: "취소 거절",
  CANCEL_COMPLETED: "취소 완료",
  REFUND_REQUEST: "환불 요청",
  REFUND_REFUSAL: "환불 거절",
  REFUND_COMPLETED: "환불 완료",
  REFUND_ERROR: "환불 오류",
  REFUND_PICK_UP_ING: "환불 수거 진행중",
  REFUND_PICK_UP_COMPLETED: "환불 수거 완료",
  EXCHANGE_REQUEST: "교환 요청",
  EXCHANGE_REFUSAL: "교환 거부",
  EXCHANGE_COMPLETED: "교환 완료",
  EXCHANGE_PICK_UP_ING: "교환 수거 진행중",
  EXCHANGE_PICK_UP_COMPLETED: "교환 수거 완료",
  EXCHANGE_ING: "교환중",
};

export enum ShipmentStatus {
  SHIPPING = "SHIPPING",
  REFUND_PICK_UP = "REFUND_PICK_UP",
  EXCHANGE_PICK_UP = "EXCHANGE_PICK_UP",
  EXCHANGE_PICK_UP_AGAIN = "EXCHANGE_PICK_UP_AGAIN",
}

export const shipmentCompanyCode = {
  "04": "CJ대한통운",
  "05": "한진택배",
  "08": "롯데택배",
  "01": "우체국택배",
  "06": "로젠택배",
  "11": "일양로지스",
  "12": "EMS",
  "13": "DHL",
  "20": "한덱스",
  "21": "FedEx",
  "14": "UPS",
  "26": "USPS",
  "22": "대신택배",
  "23": "경동택배",
  "32": "합동택배",
  "46": "CU 편의점택배",
  "24": "GS Postbox 택배",
  "25": "TNT Express",
  "16": "한의사랑택배",
  "17": "천일택배",
  "18": "건영택배",
  "28": "GSMNtoN",
  "30": "KGL네트웍스",
  "33": "DHL Global Mail",
  "34": "i-Parcel",
  "37": "LX판토스",
  "38": "ECMS Express",
  "40": "굿투럭",
  "41": "GSI Express",
  "42": "CJ대한통운 국제특송",
  "43": "애니트랙",
  "44": "SLX택배",
  "45": "우리택배(구호남택배)",
  "47": "우리한방택배",
  "48": "ACI Express",
  "49": "A.C.E EXPRESS INC",
  "50": "GPS Logix",
  "51": "성원글로벌카고",
  "53": "농협택배",
  "54": "홈픽택배",
  "55": "EuroParcel",
  "57": "Cway Express",
  "60": "YJS글로벌(영국)",
  "63": "은하쉬핑",
  "65": "YJS글로벌(월드)",
  "66": "Giant Network Group",
  "67": "디디로지스",
  "69": "대림통운",
  "70": "LOTOS CORPORATION",
  "71": "IK물류",
  "72": "성훈물류",
  "73": "CR로지텍",
  "74": "용마로지스",
  "75": "원더스퀵",
  "77": "LineExpress",
  "79": "로지스밸리택배",
  "81": "제니엘시스템",
  "82": "컬리로지스",
  "84": "스마트로지스",
  "85": "풀앳홈",
  "86": "삼성전자물류",
  "87": "이투마스(ETOMARS)",
  "88": "큐런택배",
  "89": "두발히어로",
  "90": "위니아딤채",
  "91": "하이브시티",
  "92": "지니고 당일배송",
  "93": "팬스타국제특송(PIEX)",
  "94": "오늘의픽업",
  "95": "큐익스프레스",
  "96": "로지스밸리",
  "97": "에이씨티앤코아물류",
  "99": "롯데택배 해외특송",
  "100": "나은물류",
  "101": "한샘서비스원 택배",
  "102": "배송하기좋은날(SHIPNERGY)",
  "103": "NDEX KOREA",
  "104": "도도플렉스(dodoflex)",
  "105": "BRIDGE LOGIS",
  "106": "허브넷로지스틱스",
  "107": "LG전자(판토스)",
  "108": "MEXGLOBAL",
  "109": "파테크해운항공",
  "110": "부릉",
  "111": "SBGLS",
  "112": "1004홈",
  "113": "썬더히어로",
  "114": "캐나다쉬핑",
  "116": "(주)팀프레시",
  "117": "YUNDA EXPRESS",
  "118": "롯데칠성",
  "119": "핑퐁",
  "120": "발렉스 특수물류",
  "121": "바바바(bababa)",
  "122": "BAIMA EXPRESS",
  "123": "엔티엘피스",
  "124": "LTL",
  "125": "GTS로지스",
  "126": "㈜올타코리아",
  "127": "로지스팟",
  "128": "판월드로지스틱㈜",
  "129": "홈픽 오늘도착",
  "130": "UFO로지스",
  "131": "딜리래빗",
  "132": "지오피",
  "134": "에이치케이홀딩스",
  "135": "HTNS",
  "136": "케이제이티",
  "137": "더바오",
  "138": "라스트마일",
  "139": "오늘회 러쉬",
  "140": "직구문",
  "141": "인터로지스",
  "142": "탱고앤고",
  "143": "투데이",
  "144": "큐브플로우(CUBEFLOW)",
  "145": "현대글로비스",
  "146": "국제로지스틱(KSE)",
  "147": "에스더쉬핑",
  "148": "ARGO",
  "149": "골드스넵스",
  "151": "자이언트",
  "152": "(주)엠티인터내셔널",
};

export enum MainReason {
  DEFAULT = "DEFAULT",
  NO_INTENTION = "NO_INTENTION",
  CHANGE_COLOR_OR_SIZE = "CHANGE_COLOR_OR_SIZE",
  DIFFERENT_PRODUCT = "DIFFERENT_PRODUCT",
  DELAYED_SHIPMENT = "DELAYED_SHIPMENT",
  OMITTED_SHIPMENT = "OMITTED_SHIPMENT",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DAMAGED = "DAMAGED",
  MISINFORMED = "MISINFORMED",
  MISDELIVERY = "MISDELIVERY",
  CUSTOM_MADE = "CUSTOM_MADE",
  REFUSAL_BY_CUSTOMER_REQUEST = "REFUSAL_BY_CUSTOMER_REQUEST",
  PRODUCT_ALREADY_READY = "PRODUCT_ALREADY_READY",
  SENSE_TRACE_OF_USE = "SENSE_TRACE_OF_USE",
  DAMAGED_BY_CUSTOMER = "DAMAGED_BY_CUSTOMER",
  OTHER_REASONS = "OTHER_REASONS",
}

export const mainReasonType = {
  DEFAULT: "사유를 선택해주세요.",
  NO_INTENTION: "구매 의사 취소",
  CHANGE_COLOR_OR_SIZE: "색상 및 사이즈 변경",
  DIFFERENT_PRODUCT: "다른 상품 잘못 주문",
  DELAYED_SHIPMENT: "배송 지연",
  OMITTED_SHIPMENT: "배송 누락",
  OUT_OF_STOCK: "상품 품절",
  DAMAGED: "상품 파손",
  MISINFORMED: "상품 정보 상이",
  MISDELIVERY: "오배송",
  CUSTOM_MADE: "커스터마이즈 주문제작",
  REFUSAL_BY_CUSTOMER_REQUEST: "고객 요청에 의한 거부",
  PRODUCT_ALREADY_READY: "상품 준비 완료",
  SENSE_TRACE_OF_USE: "사용 흔적이 보임",
  DAMAGED_BY_CUSTOMER: "고객에 의해 파손됨",
  OTHER_REASONS: "기타 사유",
};

export const mainReasonTypes = {
  "사유를 선택해주세요.": MainReason.DEFAULT,
  "구매 의사 취소": MainReason.NO_INTENTION,
  "색상 및 사이즈 변경": MainReason.CHANGE_COLOR_OR_SIZE,
  "다른 상품 잘못 주문": MainReason.DIFFERENT_PRODUCT,
  "배송 지연": MainReason.DELAYED_SHIPMENT,
  "배송 누락": MainReason.OMITTED_SHIPMENT,
  "상품 품절": MainReason.OUT_OF_STOCK,
  "상품 파손": MainReason.DAMAGED,
  "상품 정보 상이": MainReason.MISINFORMED,
  오배송: MainReason.MISDELIVERY,
  "커스터마이즈 주문제작": MainReason.CUSTOM_MADE,
  "고객 요청에 의한 거부": MainReason.REFUSAL_BY_CUSTOMER_REQUEST,
  "상품 준비 완료": MainReason.PRODUCT_ALREADY_READY,
  "사용 흔적이 보임": MainReason.SENSE_TRACE_OF_USE,
  "고객에 의해 파손됨": MainReason.DAMAGED_BY_CUSTOMER,
  "기타 사유": MainReason.OTHER_REASONS,
};

export const optionListType: Array<{
  id: number;
  label: string;
  value: MainReason;
  cause: Cause;
}> = [
  {
    id: 0,
    label: mainReasonType.NO_INTENTION,
    value: MainReason.NO_INTENTION,
    cause: Cause.CLIENT,
  },
  {
    id: 1,
    label: mainReasonType.CHANGE_COLOR_OR_SIZE,
    value: MainReason.CHANGE_COLOR_OR_SIZE,
    cause: Cause.CLIENT,
  },
  {
    id: 2,
    label: mainReasonType.DIFFERENT_PRODUCT,
    value: MainReason.DIFFERENT_PRODUCT,
    cause: Cause.CLIENT,
  },
  {
    id: 3,
    label: mainReasonType.DELAYED_SHIPMENT,
    value: MainReason.DELAYED_SHIPMENT,
    cause: Cause.SELLER,
  },
  {
    id: 4,
    label: mainReasonType.OMITTED_SHIPMENT,
    value: MainReason.OMITTED_SHIPMENT,
    cause: Cause.SELLER,
  },
  {
    id: 5,
    label: mainReasonType.OUT_OF_STOCK,
    value: MainReason.OUT_OF_STOCK,
    cause: Cause.SELLER,
  },
  {
    id: 6,
    label: mainReasonType.DAMAGED,
    value: MainReason.DAMAGED,
    cause: Cause.SELLER,
  },
  {
    id: 7,
    label: mainReasonType.MISINFORMED,
    value: MainReason.MISINFORMED,
    cause: Cause.SELLER,
  },
  {
    id: 8,
    label: mainReasonType.MISDELIVERY,
    value: MainReason.MISDELIVERY,
    cause: Cause.SELLER,
  },
];

export const refusalCancelOrRefundOptionList: Array<{
  id: number;
  label: string;
  value: MainReason;
}> = [
  {
    id: 0,
    label: mainReasonType.DEFAULT,
    value: MainReason.DEFAULT,
  },
  {
    id: 1,
    label: mainReasonType.CUSTOM_MADE,
    value: MainReason.CUSTOM_MADE,
  },
  {
    id: 2,
    label: mainReasonType.REFUSAL_BY_CUSTOMER_REQUEST,
    value: MainReason.REFUSAL_BY_CUSTOMER_REQUEST,
  },
  {
    id: 3,
    label: mainReasonType.PRODUCT_ALREADY_READY,
    value: MainReason.PRODUCT_ALREADY_READY,
  },
  {
    id: 4,
    label: mainReasonType.SENSE_TRACE_OF_USE,
    value: MainReason.SENSE_TRACE_OF_USE,
  },
  {
    id: 5,
    label: mainReasonType.DAMAGED_BY_CUSTOMER,
    value: MainReason.DAMAGED_BY_CUSTOMER,
  },
  {
    id: 6,
    label: mainReasonType.OTHER_REASONS,
    value: MainReason.OTHER_REASONS,
  },
];

export const refusalExchangeOptionList: Array<{
  id: number;
  label: string;
  value: MainReason;
}> = [
  {
    id: 0,
    label: mainReasonType.DEFAULT,
    value: MainReason.DEFAULT,
  },
  {
    id: 1,
    label: mainReasonType.CUSTOM_MADE,
    value: MainReason.CUSTOM_MADE,
  },
  {
    id: 2,
    label: mainReasonType.REFUSAL_BY_CUSTOMER_REQUEST,
    value: MainReason.REFUSAL_BY_CUSTOMER_REQUEST,
  },
  {
    id: 3,
    label: mainReasonType.PRODUCT_ALREADY_READY,
    value: MainReason.PRODUCT_ALREADY_READY,
  },
  {
    id: 4,
    label: mainReasonType.SENSE_TRACE_OF_USE,
    value: MainReason.SENSE_TRACE_OF_USE,
  },
  {
    id: 5,
    label: mainReasonType.DAMAGED_BY_CUSTOMER,
    value: MainReason.DAMAGED_BY_CUSTOMER,
  },
  {
    // 교환할 상품 재고 부족 Type필요
    id: 6,
    label: mainReasonType.DAMAGED_BY_CUSTOMER,
    value: MainReason.DAMAGED_BY_CUSTOMER,
  },
  {
    id: 7,
    label: mainReasonType.OTHER_REASONS,
    value: MainReason.OTHER_REASONS,
  },
];

export const exchangeOptionListType: Array<{
  id: number;
  label: string;
  value: MainReason;
  cause: Cause;
}> = [
  {
    id: 0,
    label: mainReasonType.DELAYED_SHIPMENT,
    value: MainReason.DELAYED_SHIPMENT,
    cause: Cause.SELLER,
  },
  {
    id: 1,
    label: mainReasonType.OMITTED_SHIPMENT,
    value: MainReason.OMITTED_SHIPMENT,
    cause: Cause.SELLER,
  },
  {
    id: 2,
    label: mainReasonType.OUT_OF_STOCK,
    value: MainReason.OUT_OF_STOCK,
    cause: Cause.SELLER,
  },
  {
    id: 3,
    label: mainReasonType.DAMAGED,
    value: MainReason.DAMAGED,
    cause: Cause.SELLER,
  },
  {
    id: 4,
    label: mainReasonType.MISINFORMED,
    value: MainReason.MISINFORMED,
    cause: Cause.SELLER,
  },
  {
    id: 5,
    label: mainReasonType.MISDELIVERY,
    value: MainReason.MISDELIVERY,
    cause: Cause.SELLER,
  },
];
