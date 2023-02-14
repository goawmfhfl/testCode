import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  showHasAnyProblemModal,
  systemModalVar,
} from "@cache/index";
import {
  commonSaleFilterOptionVar,
  commonCheckedOrderItemsVar,
} from "@cache/sale";

import { showHasServerErrorModal } from "@cache/productManagement";
import {
  MainReason,
  refusalCancelOrRefundOptionList,
  refusalExchangeOptionList,
} from "@constants/sale";
import { DenyRefundOrExchangeRequestType } from "@constants/sale";
import { ResetOrderItemType } from "@models/sale/index";

import {
  DenyRefundOrExchangeRequestBySellerType,
  DenyRefundOrExchangeRequestBySellerInputType,
} from "@models/sale/refund";

import {
  GET_EXCHANGE_ORDERS_BY_SELLER,
  GET_REFUND_ORDERS_BY_SELLER,
} from "@graphql/queries/getOrdersBySeller";
import { DENY_REFUND_OR_EXCHANGE_REQUEST_BY_SELLER } from "@graphql/mutations/denyRefundOrExchangeRequestBySeller";

import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";

import closeIconSource from "@icons/delete.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Button from "@components/common/Button";
import NoticeContainer from "@components/common/NoticeContainer";
import Textarea from "@components/common/input/Textarea";
import { getHandleCompleteRefundErrorCase } from "@utils/sale/refund";

const HandleRefusalRefundOrExchangeRequestModal = ({
  status,
}: {
  status: DenyRefundOrExchangeRequestType;
}) => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } = useReactiveVar(
    commonSaleFilterOptionVar
  );
  const requestType =
    status === DenyRefundOrExchangeRequestType.REFUND ? "반품" : "교환";

  const checkedOrderItems = useReactiveVar<Array<ResetOrderItemType>>(
    commonCheckedOrderItemsVar
  );
  const reconstructCheckedOrderItems: Array<ResetOrderItemType> =
    getReconstructCheckedOrderItems(checkedOrderItems);

  const [reason, setReason] = useState<{
    main: MainReason;
    detail: string;
  }>({
    main: MainReason.DEFAULT,
    detail: "",
  });

  const { main, detail } = reason;

  const refetchQuery =
    status === DenyRefundOrExchangeRequestType.EXCHANGE
      ? GET_REFUND_ORDERS_BY_SELLER
      : GET_EXCHANGE_ORDERS_BY_SELLER;

  const [denyRefundReqeust] = useMutation<
    DenyRefundOrExchangeRequestBySellerType,
    {
      input: DenyRefundOrExchangeRequestBySellerInputType;
    }
  >(DENY_REFUND_OR_EXCHANGE_REQUEST_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: refetchQuery,
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

  const changeReasonHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReason((prev) => ({
      ...prev,
      main: e.target.value as MainReason,
    }));
  };

  const changeDetailReasonHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReason((prev) => ({
      ...prev,
      detail: e.target.value,
    }));
  };

  const handleCloseButtonClick = () => {
    modalVar({
      ...modalVar(),
      isVisible: false,
    });
  };

  const handleSubmitButtonClick = () => {
    const {
      hasShippingOrderItem,
      hasShippingCompleted,
      hasRefundPickupCompleted,
    } = reconstructCheckedOrderItems.reduce(
      (result, { orderStatus, claimStatus }) => {
        if (orderStatus === "배송중") result.hasShippingOrderItem = true;
        if (orderStatus === "배송 완료") result.hasShippingCompleted = true;
        if (claimStatus === "수거완료") result.hasRefundPickupCompleted = true;

        return result;
      },
      {
        hasShippingOrderItem: false,
        hasShippingCompleted: false,
        hasRefundPickupCompleted: false,
      }
    );

    const isPickupCompletedExchangeRequest =
      hasRefundPickupCompleted &&
      DenyRefundOrExchangeRequestType.EXCHANGE === status;

    if (isPickupCompletedExchangeRequest) {
      const { hasDiffrentOrder, hasDifferentShipmentType, hasDifferentCause } =
        getHandleCompleteRefundErrorCase(reconstructCheckedOrderItems);

      if (hasDiffrentOrder) {
        showHasAnyProblemModal(
          <>
            반품 완료처리는 하나의
            <br />
            주문건 안에서만 가능합니다.
          </>
        );

        return;
      }

      if (hasDifferentShipmentType) {
        showHasAnyProblemModal(
          <>
            반품 완료처리는 하나의
            <br />
            묶음 배송 안에서만 가능합니다.
          </>
        );

        return;
      }

      if (hasDifferentCause) {
        showHasAnyProblemModal(
          <>
            반품 완료처리는 하나의
            <br />
            귀책사유 에서만 가능합니다.
          </>
        );

        return;
      }

      // modalVar({
      //   isVisible: true,
      //   component: (
      //     <HandleCompleteRefundModal
      //       cause={cause}
      //       totalPrice={totalPrice}
      //       shipmentPrice={shipmentPrice}
      //       shipmentDistantPrice={shipmentDistantPrice}
      //       mainReason={mainReason}
      //       detailedReason={detailedReason}
      //       isConditionalFree={isConditionalFree}
      //     />
      //   ),
      // });
    }

    if (!isPickupCompletedExchangeRequest) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        description: <>{requestType} 요청을 거절하시겠습니까?</>,

        confirmButtonClickHandler: () => {
          const description =
            DenyRefundOrExchangeRequestType.REFUND === status
              ? "반품 거절"
              : "교환 거절";

          try {
            void (async () => {
              loadingSpinnerVisibilityVar(true);

              const components = reconstructCheckedOrderItems.map(({ id }) => ({
                orderItemId: id,
                mainReason: main,
                detailedReason: detail,
              }));

              const {
                data: {
                  denyRefunrOrExchangeRequestBySeller: { ok, error },
                },
              } = await denyRefundReqeust({
                variables: {
                  input: {
                    components,
                    type: status,
                  },
                },
              });

              if (ok) {
                loadingSpinnerVisibilityVar(false);
                systemModalVar({
                  ...systemModalVar(),
                  isVisible: true,
                  description: (
                    <>
                      {hasShippingOrderItem && !hasShippingCompleted && (
                        <>
                          {requestType} 요청이 거절되었습니다.
                          <br />
                          (주문관리 - 배송중에서 확인 가능)
                        </>
                      )}

                      {!hasShippingOrderItem && hasShippingCompleted && (
                        <>
                          {requestType} 요청이 거절되었습니다.
                          <br />
                          (주문관리 - 배송완료에서
                          <br />
                          확인 가능)
                        </>
                      )}

                      {hasShippingOrderItem && hasShippingCompleted && (
                        <>
                          {requestType} 요청이 거절되었습니다.
                          <br />
                          (주문관리 - 배송중과 배송완료에서
                          <br />
                          확인 가능)
                        </>
                      )}
                    </>
                  ),
                  confirmButtonVisibility: true,
                  cancelButtonVisibility: false,
                  confirmButtonClickHandler: () => {
                    modalVar({
                      ...modalVar(),
                      isVisible: false,
                    });
                    systemModalVar({
                      ...systemModalVar(),
                      isVisible: false,
                    });
                    commonCheckedOrderItemsVar([]);
                    checkAllBoxStatusVar(false);
                  },
                });
              }

              if (error) {
                loadingSpinnerVisibilityVar(false);
                showHasServerErrorModal(error, description);
              }
            })();
          } catch (error) {
            loadingSpinnerVisibilityVar(false);
            showHasServerErrorModal(error as string, description);
          }
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      setReason({
        main: MainReason.DEFAULT,
        detail: "",
      });
    };
  }, []);

  return (
    <Container>
      <CloseButton onClick={handleCloseButtonClick} src={closeIconSource} />
      <Title>{requestType} 거절하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        {requestType} 거절 처리 전 반드시 소비자와 합의 후 처리해주시길
        바랍니다.
      </NoticeContainer>
      <ReasonContainer>
        <Label>대표사유</Label>
        <ReasonDropdown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"160px"}
          value={main}
          onChange={changeReasonHandler}
        >
          {refusalCancelOrRefundOptionList.map(({ id, label, value }) => (
            <Option
              value={value}
              key={id}
              hidden={value === MainReason.DEFAULT}
            >
              {label}
            </Option>
          ))}
        </ReasonDropdown>
      </ReasonContainer>

      <ReasonContainer>
        <Label>상세 사유</Label>
        <Textarea
          width="376px"
          height="88px"
          size="small"
          value={detail}
          onChange={changeDetailReasonHandler}
        />
      </ReasonContainer>

      <ButtonContainer>
        <StyledButton
          size={"small"}
          width={"55px"}
          onClick={handleSubmitButtonClick}
          disabled={reason.main === MainReason.DEFAULT || !reason.detail}
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

  min-width: 440px;

  padding: 40px 24px 24px 24px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const CloseButton = styled.img`
  position: absolute;
  top: 12.79px;
  right: 12.77px;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 24px;

  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

const ReasonContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 24px;
`;

const Label = styled.span`
  margin-bottom: 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 32px;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

const ReasonDropdown = styled(Dropdown)`
  padding-right: 0;
`;

export default HandleRefusalRefundOrExchangeRequestModal;
