import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  checkAllBoxStatusVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  systemModalVar,
} from "@cache/index";
import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";
import {
  MainReason,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
  refusalCancelOrRefundOptionList,
} from "@constants/sale";
import {
  ConfirmOrDenyCancelBySellerInputType,
  ConfirmOrDenyCancelBySellerType,
} from "@models/sale/cancel";
import { OrderCancel } from "@constants/sale/cancelManagement";
import { showHasServerErrorModal } from "@cache/productManagement";
import { checkedOrderItemsVar } from "@cache/sale";
import { ResetOrderItemType } from "@models/sale/index";

import { CONFIRM_OR_DENY_CANCEL_BY_SELLER } from "@graphql/mutations/confirmOrDenyCancelBySeller";
import { GET_CANCEL_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

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

const HandleCancelRefusalModal = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const checkedOrderItems =
    useReactiveVar<Array<ResetOrderItemType>>(checkedOrderItemsVar);
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

  const [confirmOrDenyCancel] = useMutation<
    ConfirmOrDenyCancelBySellerType,
    {
      input: ConfirmOrDenyCancelBySellerInputType;
    }
  >(CONFIRM_OR_DENY_CANCEL_BY_SELLER, {
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
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.CANCEL,
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
    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      description: (
        <>
          ???????????? ?????? ?????? ?????????
          <br />
          ?????????????????????????
        </>
      ),

      confirmButtonClickHandler: () => {
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
                confirmOrDenyCancelBySeller: { ok, error },
              },
            } = await confirmOrDenyCancel({
              variables: {
                input: {
                  components,
                  status: OrderCancel.DENY,
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
                    ?????? ????????? ?????????????????????.
                    <br />
                    ?????? ???????????? - ?????? ???????????????
                    <br />
                    ?????? ???????????????.
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
              showHasServerErrorModal(error, "?????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "?????? ??????");
        }
      },
      cancelButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
    });
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
      <Title>?????? ????????????</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        ?????? ?????? ?????? ??? ????????? ???????????? ?????? ??? ?????????????????? ????????????.
      </NoticeContainer>
      <ReasonContainer>
        <Label>????????????</Label>
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
        <Label>?????? ??????</Label>
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

export default HandleCancelRefusalModal;
