import React, { useEffect, useState } from "react";
import { useReactiveVar, useMutation } from "@apollo/client";
import styled from "styled-components/macro";

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

import { Cause, MainReason } from "@constants/sale";

import {
  CancelOrderItemsBySellerInputType,
  CancelOrderItemsBySellerType,
} from "@models/sale/order";
import { CANCEL_ORDERITEMS_BY_SELLER } from "@graphql/mutations/cancelOrderItemsBySeller";
import { GET_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

import getWhoseResponsibility from "@utils/sale/order/getWhoseResponsibility";
import getCancelOrderItemsInput from "@utils/sale/order/getCancelOrderItemsInput";

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

interface AskReasonModalType {
  option: Array<{
    id: number;
    label: string;
    value: MainReason;
    cause: Cause;
  }>;
}

const AskReasonModal = ({ option }: AskReasonModalType) => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);
  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);

  const [reason, setReason] = useState<{
    main: MainReason;
    detail: string;
    cause: Cause;
  }>({
    main: MainReason.DEFAULT,
    detail: "",
    cause: Cause.DEFAULT,
  });

  const components = getCancelOrderItemsInput(
    checkedOrderItems,
    reason.main,
    reason.detail,
    reason.cause
  );

  const [cancelOrderItems] = useMutation<
    CancelOrderItemsBySellerType,
    {
      input: CancelOrderItemsBySellerInputType;
    }
  >(CANCEL_ORDERITEMS_BY_SELLER, {
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
        const {
          data: {
            cancelOrderItemsBySeller: { ok, error },
          },
        } = await cancelOrderItems({
          variables: {
            input: { components: components },
          },
        });

        if (ok) {
          loadingSpinnerVisibilityVar(false);
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: (
              <>
                선택하신 주문이
                <br />
                취소 완료되었습니다.
                <br />
                (취소관리 - 취소완료에서 확인 가능)
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
          console.log("error", error);

          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error, "주문 취소");
        }
      })();
    } catch (error) {
      loadingSpinnerVisibilityVar(false);
      showHasServerErrorModal(error as string, "주문 취소");
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
      <Title>취소 처리하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        • &nbsp;취소 처리 전 반드시 소비자와 합의 후 처리해주시길 바랍니다.
        <br />• &nbsp;여러 주문 선택 후 취소 처리하면 같은 대표사유 및 상세
        사유로 취소
        <br />
        &nbsp;&nbsp;&nbsp;처리 됩니다.
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
          {option.map(({ id, label, value }) => (
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

export default AskReasonModal;
