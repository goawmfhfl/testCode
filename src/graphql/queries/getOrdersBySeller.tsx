import { gql } from "@apollo/client";

export const GET_ORDERS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalPages
      totalResults
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
          #구매자 결제일
          payments {
            createdAt
          }
        }

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
      }
    }
  }
`;

export const GET_ORDER_STATUS_BY_SELLER = gql`
  query GetOrdersBySeller($input: GetOrdersBySellerInput!) {
    getOrdersBySeller(input: $input) {
      ok
      error
      totalOrderItems {
        # 주문상태
        orderStatus {
          name
        }
      }
    }
  }
`;
