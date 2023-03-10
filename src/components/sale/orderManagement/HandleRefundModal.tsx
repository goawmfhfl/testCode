import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";
import {
  Cause,
  MainReason,
  optionListType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";
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
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

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
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.ORDER,
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
                ???????????? ?????????
                <br />
                ????????? ?????????????????????.
                <br />
                (???????????? - ?????????????????? ?????? ??????)
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
                ???????????????(???) <br />
                ???????????? ???????????????.
                <br />
                ?????? ?????? ??? ?????? ????????? ????????? ???
                <br />
                ??????????????? ??????????????????
                <br />
                <br />
                ???????????????:
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
      showHasServerErrorModal(error as string, "?????? ??????");
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
      <Title>?????? ????????????</Title>
      <NoticeContainer icon={exclamationmarkSrc} width={"392px"}>
        ??? &nbsp;?????? ?????? ??? ????????? ???????????? ?????? ??? ?????????????????? ????????????.
        <br />
        ??? &nbsp;????????? ?????? ????????? ??????????????? ????????? ??????????????? ???????????????.
        <br />
        ??? &nbsp;???????????? ??? ?????? ????????? ????????? ??????????????? ?????? ???????????????
        <br />
        &nbsp;&nbsp;&nbsp;???????????? ??????????????? ?????? ???????????? ???????????????
      </NoticeContainer>
      <ReasonContainer>
        <Label>????????????</Label>
        <ReasonDropdown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"160px"}
          value={reason.main}
          onChange={changeReasonHandler}
        >
          <Option value={MainReason.DEFAULT} hidden>
            ????????? ??????????????????
          </Option>
          {optionListType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
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

export default HandleRefundModal;
