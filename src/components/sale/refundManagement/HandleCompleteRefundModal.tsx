import React from "react";
import styled from "styled-components";

import { Cause } from "@constants/sale";

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import exclamationGreySrc from "@icons/exclamation-grey.svg";
import NoticeContainer, {
  Container as PopupContainer,
  NoticeText,
  NoticeIcon,
} from "@components/common/NoticeContainer";
import Input from "@components/common/Input";
import Button from "@components/common/Button";

const HandleCompleteRefundModal = ({
  cause,
  totalPrice,
  shipmentPrice,
  shipmentDistantPrice,
  mainReason,
  detailedReason,
  isConditionalFree,
}: {
  cause: Cause;
  totalPrice: number;
  shipmentPrice: number;
  shipmentDistantPrice: number;
  mainReason: string;
  detailedReason: string;
  isConditionalFree: boolean;
}) => {
  return (
    <Container>
      <Title>반품 완료처리하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"455px"}>
        아래의 환불 사유 및 금액대로 환불될 예정입니다. 환불 사유 수정을 원하실
        경우
        <br />
        현재 창을 나가셔서 주문건 선택 후 ‘환불 사유 수정'버튼을 눌러
        진행해주시길 바
        <br />
        랍니다.
      </NoticeContainer>

      <ReasonContainer>
        <Label>환불 사유</Label>
        <Reason>{detailedReason}</Reason>
      </ReasonContainer>

      <RefundAmountContainer>
        <Label>환불 금액</Label>
        <CalculateRefundAmountContainer>
          <WhoseCause>{cause}</WhoseCause>

          <RefundContainer>
            <RefundLabel>결제 금액(상품가+최초배송비)</RefundLabel>
            <RefundPrice>{totalPrice}</RefundPrice>
          </RefundContainer>

          <RefundContainer>
            <RefundLabel>-최초 배송비</RefundLabel>
            <RefundPrice>{shipmentPrice}</RefundPrice>
          </RefundContainer>

          <RefundShipmentContainer>
            <RefundLabel>-반품 배송비(편도)</RefundLabel>
            <RefundShipmentInput />

            <ExclamationIconContainer>
              <ExclamationIcon src={exclamationGreySrc} />
              <StyledNoticeContainer width="363px" className={"notice"}>
                <NoticeIcon src={exclamationGreySrc} />
                <NoticeText>
                  • &nbsp;반품 배송비가 설정되어 있던 금액과 다를 경우 수정해
                  <br />
                  &nbsp;&nbsp;&nbsp;주세요.
                  <br />• &nbsp;소비자 귀책 사유의 경우에 소비자가 반품 배송비를
                  미리 <br />
                  &nbsp;&nbsp;&nbsp;송금 혹은 택배에 동봉 했다면 반품 배송비를
                  ‘0원'으로 입
                  <br />
                  &nbsp;&nbsp;&nbsp;력해주세요.
                </NoticeText>
              </StyledNoticeContainer>
            </ExclamationIconContainer>
          </RefundShipmentContainer>

          <TotalPayAmountContainer>
            <TotalPaymentLabel>최종 환불 금액</TotalPaymentLabel>
            <TotalPaymentAmount>45,000</TotalPaymentAmount>
          </TotalPayAmountContainer>
        </CalculateRefundAmountContainer>
      </RefundAmountContainer>

      <ButtonContainer>
        <StyledButton size={"small"} width={"55px"} className={"positive"}>
          확인
        </StyledButton>
        <Button size={"small"} width={"55px"}>
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  max-width: 503px;

  padding: 24px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const Title = styled.h1`
  margin-bottom: 24px;

  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const ReasonContainer = styled.div`
  display: flex;

  margin-top: 24px;
`;

const Label = styled.h2`
  min-width: 152px;

  ${({
    theme: {
      typo: {
        korean: {
          headline: { basic },
        },
      },
    },
  }) => basic};
`;

const Reason = styled.span`
  ${({
    theme: {
      typo: {
        korean: {
          body: {
            secondary: { basic },
          },
        },
      },
    },
  }) => basic};
`;

const RefundAmountContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const CalculateRefundAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const WhoseCause = styled.span`
  margin-bottom: 8px;

  ${({
    theme: {
      typo: {
        korean: {
          body: {
            secondary: { emphasized },
          },
        },
      },
    },
  }) => emphasized}
`;

const RefundContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RefundLabel = styled.span`
  width: 160px;

  ${({
    theme: {
      typo: {
        korean: {
          body: {
            secondary: { basic },
          },
        },
      },
    },
  }) => basic};
`;

const RefundPrice = styled.span`
  ${({
    theme: {
      typo: {
        korean: {
          body: {
            secondary: { emphasized },
          },
        },
      },
    },
  }) => emphasized}
`;

const RefundShipmentContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const RefundShipmentInput = styled(Input)`
  padding: 9px 8px;
  width: 103px;
  height: 32px;

  margin-right: 8px;
`;

const ExclamationIconContainer = styled.div`
  position: relative;

  &:hover .notice {
    display: flex;
  }
`;

const StyledNoticeContainer = styled(PopupContainer)`
  display: none;

  position: absolute;
  top: -8px;
  left: 0px;

  transform: translateY(-100%);
`;

const ExclamationIcon = styled.img``;

const TotalPayAmountContainer = styled.div`
  display: flex;
`;

const TotalPaymentLabel = styled.span`
  width: 160px;

  ${({
    theme: {
      typo: {
        korean: {
          headline: { basic },
        },
      },
    },
  }) => basic}
`;

const TotalPaymentAmount = styled.span`
  ${({
    theme: {
      typo: {
        korean: {
          headline: { emphasized },
        },
      },
    },
  }) => emphasized}
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

export default HandleCompleteRefundModal;
