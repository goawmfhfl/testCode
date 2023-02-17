import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import { Cause, causeType, ShipmentType } from "@constants/sale";
import {
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";
import { commonSaleFilterOptionVar } from "@cache/sale";

import {
  EstimateRefundAmountInputType,
  EstimateRefundAmountType,
} from "@models/sale";

import { COMPLETE_REFUND_BY_SELLER } from "@graphql/mutations/completeRefundBySeller";
import { GET_REFUND_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { ESTIMATE_REFUND_AMOUNT } from "@graphql/mutations/estimateRefundAmout";

import {
  CompleteRefundBySellerInputType,
  CompleteRefundBySellerType,
} from "@models/sale/refund";

import reconstructRefundInformation from "@utils/sale/reconstructRefundInformation";

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
  orderItemIds,
  cause,
  detailedReason,
}: {
  orderItemIds: Array<number>;
  cause: Cause;
  detailedReason: string;
}) => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } = useReactiveVar(
    commonSaleFilterOptionVar
  );

  const [refundInformation, setRefundInformation] = useState<{
    totalProductAmount: number;
    initialShipmentAmount: number;
    initialShipmentDistantAmount: number;
    shipmentRefundAmount: number;
    bundleShipmentType: ShipmentType;
    isConditionalAmountBreak: boolean;
    isAllOrderItemRefunded: boolean;
    isFreeBreak: boolean;
  }>({
    totalProductAmount: 0,
    initialShipmentAmount: 0,
    initialShipmentDistantAmount: 0,
    shipmentRefundAmount: 0,
    bundleShipmentType: null,
    isConditionalAmountBreak: null,
    isAllOrderItemRefunded: null,
    isFreeBreak: null,
  });

  const {
    totalProductAmount,
    initialShipmentAmount,
    initialShipmentDistantAmount,
    shipmentRefundAmount,
    sign,
  } = reconstructRefundInformation(refundInformation, cause);

  const {
    shipmentRefundAmount: shipmentRefundPrice,
    initialShipmentDistantAmount: shipmentDistantPrice,
  } = refundInformation;

  const [calculateTotalRefundAmount, setCalculateTotalRefundAmount] =
    useState<number>(0);
  const [handleRefundAmount, setHandleRefundAmount] = useState<string>("");
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const [completeRefund] = useMutation<
    CompleteRefundBySellerType,
    {
      input: CompleteRefundBySellerInputType;
    }
  >(COMPLETE_REFUND_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_REFUND_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type,
            statusName,
            statusType,
            statusGroup,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [estimateRefundAmount] = useMutation<
    EstimateRefundAmountType,
    {
      input: EstimateRefundAmountInputType;
    }
  >(ESTIMATE_REFUND_AMOUNT, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const changeRefundShipmentHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value: string = e.target.value;

    const deleteComma: string = value.replaceAll(",", "");
    const deleteSignAndComma = Number(deleteComma.replaceAll(sign, ""));

    if (isNaN(deleteSignAndComma)) {
      return;
    }

    const addSignAndCommaRefundAmount = `${sign} ${deleteSignAndComma.toLocaleString()}`;
    setHandleRefundAmount(addSignAndCommaRefundAmount);
    setCalculateTotalRefundAmount(totalProductAmount - deleteSignAndComma);
    setRefundAmount(deleteSignAndComma);
  };

  const handleSubmitButtonClick = () => {
    void (async () => {
      try {
        loadingSpinnerVisibilityVar(true);

        const components = orderItemIds.map((id) => ({
          orderItemId: id,
          cause,
          totalAmount: calculateTotalRefundAmount,
          shipmentReturnAmount: refundAmount,
        }));

        const {
          data: {
            completeRefundBySeller: { ok, error },
          },
        } = await completeRefund({
          variables: {
            input: { components },
          },
          fetchPolicy: "no-cache",
          notifyOnNetworkStatusChange: true,
          errorPolicy: "all",
        });

        if (ok) {
          loadingSpinnerVisibilityVar(false);
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: (
              <>
                반품 처리가 완료되었습니다.
                <br />
                (자동 환불되나 구매고객 결제수단에 따라
                <br />
                환불 소요일이 다를 수 있습니다.)
              </>
            ),
            confirmButtonVisibility: true,
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });
        }

        if (error) {
          loadingSpinnerVisibilityVar(false);
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: (
              <>
                PG사 또는 네트워크 오류로 인해
                <br />
                반품 완료처리가 되지 않았습니다.
                <br />
                반품 완료처리 버튼을 다시 눌러주세요.
              </>
            ),
            confirmButtonVisibility: true,
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
            },
          });
        }
      } catch (error) {
        loadingSpinnerVisibilityVar(false);
        console.log(error);
      }
    })();
  };

  useEffect(() => {
    loadingSpinnerVisibilityVar(true);
    try {
      void (async () => {
        const {
          data: {
            estimateRefundAmount: {
              ok,
              error,
              totalProductAmount,
              initialShipmentAmount,
              initialShipmentDistantAmount,
              shipmentRefundAmount,
              bundleShipmentType,
              isConditionalAmountBreak,
              isAllOrderItemRefunded,
              isFreeBreak,
            },
          },
        } = await estimateRefundAmount({
          variables: {
            input: {
              orderItemIds,
              cause,
            },
          },
          fetchPolicy: "no-cache",
          notifyOnNetworkStatusChange: true,
          errorPolicy: "all",
        });

        if (ok) {
          loadingSpinnerVisibilityVar(false);
          setRefundInformation({
            totalProductAmount: totalProductAmount ?? 0,
            initialShipmentAmount: initialShipmentAmount ?? 0,
            initialShipmentDistantAmount: initialShipmentDistantAmount ?? 0,
            shipmentRefundAmount: shipmentRefundAmount ?? 0,
            bundleShipmentType,
            isConditionalAmountBreak,
            isAllOrderItemRefunded,
            isFreeBreak,
          });
        }

        if (error) {
          loadingSpinnerVisibilityVar(false);
          console.log(error);
        }
      })();
    } catch (error) {
      loadingSpinnerVisibilityVar(false);
      console.log(error);
    }
  }, [orderItemIds, cause]);

  useEffect(() => {
    const refundAmount = shipmentDistantPrice + shipmentRefundPrice;
    const addSignAndCommaRefundAmount = `${sign} ${refundAmount.toLocaleString()}`;

    setHandleRefundAmount(addSignAndCommaRefundAmount);
    setRefundAmount(refundAmount);

    if (cause === Cause.CLIENT) {
      setCalculateTotalRefundAmount(totalProductAmount - refundAmount);
    }

    if (cause === Cause.SELLER) {
      setCalculateTotalRefundAmount(totalProductAmount + refundAmount);
    }
  }, [refundInformation]);

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
          <WhoseCause>{causeType[cause]} 귀책</WhoseCause>

          <RefundInformationContainer>
            <RefundInformationLabel>상품금액</RefundInformationLabel>
            <RefundInformationPrice>
              {totalProductAmount.toLocaleString("ko-Kr")}
            </RefundInformationPrice>
          </RefundInformationContainer>

          {initialShipmentAmount ? (
            <RefundInformationContainer>
              <RefundInformationLabel>최초 배송비</RefundInformationLabel>
              <RefundInformationPrice>
                {`${sign} ${initialShipmentAmount.toLocaleString("Ko-kr")}`}
              </RefundInformationPrice>
            </RefundInformationContainer>
          ) : null}

          {initialShipmentDistantAmount ? (
            <RefundInformationContainer>
              <RefundInformationLabel>
                최초 추가 배송비(제주도서산간)
              </RefundInformationLabel>
              <RefundInformationPrice>
                {`${sign} ${initialShipmentDistantAmount.toLocaleString(
                  "Ko-kr"
                )}`}
              </RefundInformationPrice>
            </RefundInformationContainer>
          ) : null}

          {shipmentRefundAmount ? (
            <RefundShipmentContainer>
              <RefundInformationLabel>반품 배송비(편도)</RefundInformationLabel>
              <RefundShipmentInput
                type={"text"}
                value={handleRefundAmount}
                onChange={changeRefundShipmentHandler}
              />

              <ExclamationIconContainer>
                <ExclamationIcon src={exclamationGreySrc} />
                <StyledNoticeContainer width="363px" className={"notice"}>
                  <NoticeIcon src={exclamationGreySrc} />
                  <NoticeText>
                    • &nbsp;반품 배송비가 설정되어 있던 금액과 다를 경우 수정해
                    <br />
                    &nbsp;&nbsp;&nbsp;주세요.
                    <br />• &nbsp;소비자 귀책 사유의 경우에 소비자가 반품
                    배송비를 미리 <br />
                    &nbsp;&nbsp;&nbsp;송금 혹은 택배에 동봉 했다면 반품 배송비를
                    ‘0원'으로 입
                    <br />
                    &nbsp;&nbsp;&nbsp;력해주세요.
                  </NoticeText>
                </StyledNoticeContainer>
              </ExclamationIconContainer>
            </RefundShipmentContainer>
          ) : null}

          <TotalPayAmountContainer>
            <TotalPaymentLabel>최종 환불 금액</TotalPaymentLabel>
            <TotalPaymentAmount>
              {calculateTotalRefundAmount.toLocaleString("Ko-kr")}
            </TotalPaymentAmount>
          </TotalPayAmountContainer>
        </CalculateRefundAmountContainer>
      </RefundAmountContainer>

      <ButtonContainer>
        <StyledButton
          size={"small"}
          width={"55px"}
          className={"positive"}
          onClick={handleSubmitButtonClick}
        >
          확인
        </StyledButton>
        <Button size={"small"} width={"55px"} onClick={handleCloseButtonClick}>
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

const RefundInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RefundInformationLabel = styled.span`
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

const RefundInformationPrice = styled.span`
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
