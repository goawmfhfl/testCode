import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";
import {
  Cause,
  causeType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";
import {
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";

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

import exclamationmarkSrc from "@icons/exclamationmark.svg";
import exclamationGreySrc from "@icons/exclamation-grey.svg";
import NoticeContainer, {
  Container as PopupContainer,
  NoticeText,
  NoticeIcon,
} from "@components/common/NoticeContainer";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import { showHasServerErrorModal } from "@cache/productManagement";

export interface RefundInformation {
  totalProductAmount: number;
  initialShipmentAmount: number;
  initialShipmentDistantAmount: number | null;
  shipmentRefundAmount: number;
  shipmentRefundDistantAmount: number | null;
  finalRefundAmount: number;
}

const HandleCompleteRefundModal = ({
  type,
  orderItemIds,
  orderByShopId,
  cause,
  detailedReason,
}: {
  type: OrderStatusGroup;
  orderItemIds: Array<number>;
  orderByShopId: number;
  cause: Cause;
  detailedReason: string;
}) => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);

  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const [refundInformation, setRefundInformation] = useState<RefundInformation>(
    {
      totalProductAmount: 0,
      initialShipmentAmount: 0,
      initialShipmentDistantAmount: 0,
      shipmentRefundAmount: 0,
      shipmentRefundDistantAmount: 0,
      finalRefundAmount: 0,
    }
  );
  const {
    totalProductAmount,
    initialShipmentAmount,
    initialShipmentDistantAmount,
    shipmentRefundAmount,
    shipmentRefundDistantAmount,
  } = refundInformation;

  const [handleShipmentNumberType, setHandleShipmentNumberType] = useState<{
    initialShipment: number;
    shipmentRefund: number;
    shipmentRefundDistant: number;
  }>({
    initialShipment: 0,
    shipmentRefund: 0,
    shipmentRefundDistant: 0,
  });

  const { initialShipment, shipmentRefund, shipmentRefundDistant } =
    handleShipmentNumberType;

  const [finalRefund, setFinalRefund] = useState<number>(0);

  const [completeRefund] = useMutation<
    CompleteRefundBySellerType,
    {
      input: CompleteRefundBySellerInputType;
    }
  >(COMPLETE_REFUND_BY_SELLER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_REFUND_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: type,
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
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const handleRefundShipmentAmountChange =
    (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value: string = e.target.value;

      if (isNaN(Number(value))) {
        return;
      }

      setHandleShipmentNumberType((prev) => ({
        ...prev,
        [type]: Number(value),
      }));
    };

  const handleSubmitButtonClick = () => {
    void (async () => {
      try {
        loadingSpinnerVisibilityVar(true);

        const {
          data: {
            completeRefundBySeller: { ok, error },
          },
        } = await completeRefund({
          variables: {
            input: {
              orderItemIds,
              orderByShopId,
              cause,
              isDistant: false,
              totalProductAmount,
              initialShipmentAmount: initialShipment,
              initialShipmentDistantAmount,
              shipmentRefundAmount: shipmentRefund,
              shipmentRefundDistantAmount: shipmentRefundDistant,
            },
          },
          fetchPolicy: "network-only",
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
                ?????? ????????? ?????????????????????.
                <br />
                (?????? ???????????? ???????????? ??????????????? ??????
                <br />
                ?????? ???????????? ?????? ??? ????????????.)
              </>
            ),
            confirmButtonVisibility: true,
            cancelButtonVisibility: false,
            confirmButtonClickHandler: () => {
              systemModalVar({
                ...systemModalVar(),
                isVisible: false,
              });
              modalVar({
                ...modalVar(),
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
                PG??? ?????? ???????????? ????????? ??????
                <br />
                ?????? ??????????????? ?????? ???????????????.
                <br />
                ?????? ???????????? ????????? ?????? ???????????????.
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
        showHasServerErrorModal(error as string, "?????? ??????");
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
              shipmentRefundDistantAmount,
              finalRefundAmount,
            },
          },
        } = await estimateRefundAmount({
          variables: {
            input: {
              orderItemIds,
              orderByShopId,
              cause,
            },
          },
          fetchPolicy: "network-only",
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
            shipmentRefundDistantAmount: shipmentRefundDistantAmount ?? 0,
            finalRefundAmount: finalRefundAmount ?? 0,
          });
        }

        if (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error, "?????? ????????????");
        }
      })();
    } catch (error) {
      loadingSpinnerVisibilityVar(false);
      showHasServerErrorModal(error as string, "?????? ????????????");
    }
  }, []);

  useEffect(() => {
    setHandleShipmentNumberType({
      initialShipment: initialShipmentAmount,
      shipmentRefund: shipmentRefundAmount,
      shipmentRefundDistant: shipmentRefundDistantAmount,
    });
  }, [refundInformation]);

  useEffect(() => {
    setFinalRefund(
      totalProductAmount +
        initialShipment +
        initialShipmentDistantAmount +
        shipmentRefund +
        shipmentRefundDistant
    );
  }, [handleShipmentNumberType]);

  return (
    <Container>
      <Title>?????? ??????????????????</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"495px"}>
        ????????? ?????? ?????? ??? ???????????? ????????? ???????????????. ?????? ?????? ????????? ?????????
        ??????
        <br />
        ?????? ?????? ???????????? ????????? ?????? ??? ????????? ?????? ??????'????????? ??????2
        ?????????????????? ????????????.
      </NoticeContainer>

      <ReasonContainer>
        <Label>?????? ??????</Label>
        <Reason>{detailedReason}</Reason>
      </ReasonContainer>

      <RefundAmountContainer>
        <Label>?????? ??????</Label>
        <CalculateRefundAmountContainer>
          <WhoseCause>{causeType[cause]} ??????</WhoseCause>

          <RefundInformationContainer>
            <RefundInformationLabel>????????????</RefundInformationLabel>
            <RefundInformationPrice>
              {totalProductAmount.toLocaleString()}
            </RefundInformationPrice>
          </RefundInformationContainer>

          {initialShipmentAmount === 0 && null}

          {initialShipmentAmount > 0 && (
            <RefundInformationContainer>
              <RefundInformationLabel>?????? ?????????</RefundInformationLabel>
              <RefundInformationPrice>
                {`+ ${initialShipmentAmount.toLocaleString()}`}
              </RefundInformationPrice>
            </RefundInformationContainer>
          )}

          {initialShipmentAmount < 0 && (
            <RefundShipmentContainer>
              <RefundInformationLabel>?????? ????????? ??????</RefundInformationLabel>
              <RefundShipmentInput
                type={"number"}
                value={initialShipment ? initialShipment : ""}
                onChange={handleRefundShipmentAmountChange("initialShipment")}
              />
              <ExclamationIconContainer>
                <ExclamationIcon src={exclamationGreySrc} />
                <StyledNoticeContainer width="363px" className={"notice"}>
                  <NoticeIcon src={exclamationGreySrc} />
                  <NoticeText>
                    ??? &nbsp;?????? ???????????? ???????????? ?????? ????????? ?????? ?????? ?????????
                    <br />
                    &nbsp;&nbsp;&nbsp;?????????.
                    <br />??? &nbsp;????????? ?????? ????????? ????????? ???????????? ??????
                    ???????????? ?????? <br />
                    &nbsp;&nbsp;&nbsp;?????? ?????? ????????? ?????? ????????? ?????? ????????????
                    ???0???'?????? ???
                    <br />
                    &nbsp;&nbsp;&nbsp;???????????????.
                  </NoticeText>
                </StyledNoticeContainer>
              </ExclamationIconContainer>
            </RefundShipmentContainer>
          )}

          {Boolean(initialShipmentDistantAmount) && (
            <RefundInformationContainer>
              <RefundInformationLabel>
                ?????? ?????? ?????????(??????????????????)
              </RefundInformationLabel>
              <RefundInformationPrice>
                {`${initialShipmentDistantAmount.toLocaleString()}`}
              </RefundInformationPrice>
            </RefundInformationContainer>
          )}

          {cause === Cause.CLIENT ? (
            <RefundShipmentContainer>
              <RefundInformationLabel>
                ?????? ?????????(??????) {shipmentRefundAmount < 0 && "??????"}
              </RefundInformationLabel>
              <RefundShipmentInput
                type={"number"}
                value={shipmentRefund ? shipmentRefund : ""}
                onChange={handleRefundShipmentAmountChange("shipmentRefund")}
              />
            </RefundShipmentContainer>
          ) : null}

          {cause === Cause.CLIENT && Boolean(shipmentRefundDistantAmount) && (
            <RefundShipmentContainer>
              <RefundInformationLabel>
                ?????? ?????? ?????????(??????????????????){" "}
                {shipmentRefundDistantAmount < 0 && "??????"}
              </RefundInformationLabel>
              <RefundShipmentInput
                type={"number"}
                value={shipmentRefundDistant ? shipmentRefundDistant : ""}
                onChange={handleRefundShipmentAmountChange(
                  "shipmentRefundDistant"
                )}
              />
              <ExclamationIconContainer>
                <ExclamationIcon src={exclamationGreySrc} />
                <StyledNoticeContainer width="363px" className={"notice"}>
                  <NoticeIcon src={exclamationGreySrc} />
                  <NoticeText>
                    ??? &nbsp;?????? ???????????? ???????????? ?????? ????????? ?????? ?????? ?????????
                    <br />
                    &nbsp;&nbsp;&nbsp;?????????.
                    <br />??? &nbsp;????????? ?????? ????????? ????????? ???????????? ??????
                    ???????????? ?????? <br />
                    &nbsp;&nbsp;&nbsp;?????? ?????? ????????? ?????? ????????? ?????? ????????????
                    ???0???'?????? ???
                    <br />
                    &nbsp;&nbsp;&nbsp;???????????????.
                  </NoticeText>
                </StyledNoticeContainer>
              </ExclamationIconContainer>
            </RefundShipmentContainer>
          )}

          <TotalPayAmountContainer>
            <TotalPaymentLabel>?????? ?????? ??????</TotalPaymentLabel>
            <TotalPaymentAmount>
              {`${finalRefund.toLocaleString()} ???`}
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
          ??????
        </StyledButton>
        <Button size={"small"} width={"55px"} onClick={handleCloseButtonClick}>
          ??????
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

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
  width: 200px;
  height: 100%;

  display: flex;
  align-items: center;
  margin-right: 8px;

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
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &[type="number"] {
    -moz-appearance: "textfield";
  }
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
