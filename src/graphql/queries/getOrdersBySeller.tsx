import { gql } from "@apollo/client";
import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@models/order/orderManagement";

export interface GetOrdersBySellerInputType {
  input: {
    page?: number;
    skip?: number;
    query?: string;
    type?: OrderSearchType;
    statusName?: OrderStatusName;
    statusType?: OrderStatusType;
    statusGroup?: OrderStatusGroup;
  };
}

export interface OrderItemsType {
  id: number;
  // 주문 번호
  merchantItemUid: string;

  product: {
    // 상품 번호
    code: string;
    // 상품 썸네일
    thumbnail: string;
    // 주문 상품
    name: string;
  };

  user: {
    // 유저 이름
    name: string;
    // 유저 이메일
    email: string;
    // 유저 핸드폰번호
    phoneNumber: string;
  };

  orderByShop: {
    order: {
      // 수취인 명
      recipientName: string;
      // 수취인 번호
      recipientPhoneNumber: string;
      // 수취인 주소
      recipientAddress: string;
      // 수취인 우편번호
      postCode?: number;
      // 수취인 배송메모
      shipmentMemo?: string;
    };
  };

  options: Array<{
    // 옵션명
    components: Array<{
      name: string;
      value: string;
    }>;

    // 옵션 가격
    price: number;
  }>;

  // 상품 갯수
  quantity: number;

  // 상품가
  discountAppliedPrice: number;
  originalPrice: number;

  // 배송비
  shipmentPrice: number;
  // 도서산간 배송비
  shipmentDistantPrice: number;

  // 주문상태
  orderStatus: {
    name: OrderStatusName;
  };

  // 클레임상태
  claimStatus: {
    name: OrderStatusName;
  };

  // 결제일
  // payments: {
  //   createdAt: string;
  // };
}

export interface GetOrdersBySellerType {
  getOrdersBySeller: {
    ok: boolean;
    error: string;
    totalOrderItems: Array<OrderItemsType>;
  };
}

export const GET_ORDERS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalOrderItems {
        #아이디
        id

        #주문번호
        merchantItemUid

        product {
          #상품 주문번호
          code
          #상품 섬네일
          thumbnail
          #주문 상품
          name
        }

        user {
          #구매자명
          name
          #구매자 아이디
          email
          #구매자 전화번호
          phoneNumber
        }

        # 결제일

        orderByShop {
          order {
            # 수취인
            recipientName
            # 수취인 전화번호
            recipientPhoneNumber
            # 수취인 주소
            recipientAddress
            # 우편 번호
            postCode
            # 배송 메세지
            shipmentMemo
          }
        }

        options {
          # 옵션명
          components {
            name
            value
          }
          # 옵션가
          price
        }
        # 상품개수
        quantity

        # 상품가
        discountAppliedPrice
        originalPrice

        # 배송비
        shipmentPrice

        # 도서산간 배송비
        shipmentDistantPrice

        # 주문상태
        orderStatus {
          name
        }

        # 클레임상태
        claimStatus {
          name
        }

        # 결제일
        # payments {
        #   createdAt
        # }
      }
    }
  }
`;
