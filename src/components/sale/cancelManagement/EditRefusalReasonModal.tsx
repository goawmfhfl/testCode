import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";
import { filterOptionVar } from "@cache/sale/cancel";
import { checkedOrderItemsVar } from "@cache/sale";
import { showHasServerErrorModal } from "@cache/productManagement";
import {
  MainReason,
  refusalOptionListType,
  OrderStatusName,
} from "@constants/sale";

import {
  EditStatusReasonBySellerInputType,
  EditStatusReasonBySellerType,
} from "@models/sale/cancel";

import { GET_CANCEL_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { EDIT_STATUS_REASON_BY_SELLER } from "@graphql/mutations/editStatusReasonBySeller";

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

const EditRefusalReasonModal = ({ orderItemId }: { orderItemId: number }) => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const [reason, setReason] = useState<{
    main: MainReason;
    detail: string;
  }>({
    main: MainReason.DEFAULT,
    detail: "",
  });

  const { main, detail } = reason;

  const [editStatusReason] = useMutation<
    EditStatusReasonBySellerType,
    {
      input: EditStatusReasonBySellerInputType;
    }
  >(EDIT_STATUS_REASON_BY_SELLER, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_CANCEL_ORDERS_BY_SELLER,
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
    try {
      void (async () => {
        loadingSpinnerVisibilityVar(true);
        const {
          data: {
            editStatusReasonBySeller: { ok, error },
          },
        } = await editStatusReason({
          variables: {
            input: {
              orderItemId,
              mainReason: main,
              detailedReason: detail,
              orderStatusName: OrderStatusName.CANCEL_REQUEST,
            },
          },
        });

        if (ok) {
          loadingSpinnerVisibilityVar(false);
          systemModalVar({
            ...systemModalVar(),
            isVisible: true,
            description: <>취소 사유가 수정되었습니다.</>,
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
                취소 사유 수정을(를) <br />
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
      showHasServerErrorModal(error as string, "취소 사유 수정");
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
      <Title>취소 거절하기</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        취소 거부 처리 전 반드시 소비자와 합의 후 처리해주시길 바랍니다.
      </NoticeContainer>
      <ReasonContainer>
        <Label>대표사유</Label>
        <ReasonDropdown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"160px"}
          onChange={changeReasonHandler}
        >
          {refusalOptionListType.map(({ id, label, value }) => (
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

export default EditRefusalReasonModal;
