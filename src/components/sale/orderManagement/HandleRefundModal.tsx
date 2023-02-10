import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useReactiveVar, useMutation } from "@apollo/client";

import {
  modalVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  checkAllBoxStatusVar,
  systemModalVar,
} from "@cache/index";
import { checkedOrderItemsVar } from "@cache/sale";
import { showHasServerErrorModal } from "@cache/productManagement";
import { filterOptionVar } from "@cache/sale/order";

import { Cause, MainReason, optionListType } from "@constants/sale";
import { RequestRefundOrExchange } from "@constants/sale/orderManagement";
import {
  RequestRefundOrExchangeBySellerInputType,
  RequestRefundOrExchangeBySellerType,
} from "@models/sale/order";
import { ResetOrderItemType } from "@models/sale/index";

import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { REQEUST_REFUND_OR_EXCHANGE_BY_SELLER } from "@graphql/mutations/requestRefundOrExchangeBySeller";

import getWhoseResponsibility from "@utils/sale/order/getWhoseResponsibility";
import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";
import getCancelOrderItemComponents from "@utils/sale/order/getCancelOrderItemComponents";

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

const HandleRefundModal = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const checkedOrderItems =
    useReactiveVar<Array<ResetOrderItemType>>(checkedOrderItemsVar);
  const reconstructCheckedOrderItems =
    getReconstructCheckedOrderItems(checkedOrderItems);
  const checkedOrderItemIds = reconstructCheckedOrderItems.map(({ id }) => id);

  const [reason, setReason] = useState<{
    main: MainReason;
    detail: string;
    cause: Cause;
  }>({
    main: MainReason.DEFAULT,
    detail: "",
    cause: Cause.DEFAULT,
  });

  const [requestRefundOrExchange] = useMutation<
    RequestRefundOrExchangeBySellerType,
    {
      input: RequestRefundOrExchangeBySellerInputType;
    }
  >(REQEUST_REFUND_OR_EXCHANGE_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_ORDERS_BY_SELLER,
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
    const cause: Cause = getWhoseResponsibility(e.target.value as MainReason);

    setReason((prev) => ({
      ...prev,
      main: e.target.value as MainReason,
      cause,
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
    try {
      void (async () => {
        loadingSpinnerVisibilityVar(true);
        const components = getCancelOrderItemComponents(
          checkedOrderItemIds,
          reason
        );

        const {
          data: {
            requestRefundOrExchangeBySeller: { ok, error },
          },
        } = await requestRefundOrExchange({
          variables: {
            input: {
              components,
              status: RequestRefundOrExchange.REFUND,
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
                선택하신 주문의
                <br />
                반품이 요청되었습니다.
                <br />
                (반품관리 - 반품요청에서 처리 가능)
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
              checkedOrderItemsVar([]);
              checkAllBoxStatusVar(false);
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
                반품처리을(를) <br />
                완료하지 못했습니다.
                <br />
                다시 시도 후 같은 문제가 발생할 시
                <br />
                찹스틱스에 문의해주세요
                <br />
                <br />
                에러메시지:
                <br />
                {error}
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
      })();
    } catch (error) {
      loadingSpinnerVisibilityVar(false);
      showHasServerErrorModal(error as string, "반품 처리");
    }
  };

  useEffect(() => {
    return () => {
      setReason({
        main: MainReason.DEFAULT,
        detail: "",
        cause: Cause.DEFAULT,
      });
    };
  }, []);

  return (
    <Container>
      <CloseButton onClick={handleCloseButtonClick} src={closeIconSource} />
      <Title>반품 처리하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        • &nbsp;반품 처리 전 반드시 소비자와 합의 후 처리해주시길 바랍니다.
        <br />
        • &nbsp;상품별 부분 취소는 가능하지만 옵션별 부분취소는 불가합니다.
        <br />
        • &nbsp;수거완료 후 환불 처리시 선택된 대표사유에 의해 환불금액이
        <br />
        &nbsp;&nbsp;&nbsp;결정되니 환불비용을 따로 청구히지 말아주세요
      </NoticeContainer>
      <ReasonContainer>
        <Label>대표사유</Label>
        <ReasonDropdown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"160px"}
          value={reason.main}
          onChange={changeReasonHandler}
        >
          <Option value={MainReason.DEFAULT} hidden>
            사유를 선택해주세요
          </Option>
          {optionListType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
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

export default HandleRefundModal;
