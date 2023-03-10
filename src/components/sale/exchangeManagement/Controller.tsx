import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import { checkedOrderItemsVar } from "@cache/sale";
import {
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  modalVar,
  paginationSkipVar,
  showHasAnyProblemModal,
  systemModalVar,
} from "@cache/index";
import { showHasServerErrorModal } from "@cache/productManagement";
import {
  DenyRefundOrExchangeRequestType,
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  orderStatusNameType,
  OrderStatusType,
  searchQueryType,
  SendType,
} from "@constants/sale";
import {
  decryptSaleNameId,
  decryptSaleTypeId,
  skipQuantityType,
} from "@constants/index";
import { changeOrderStatusType } from "@constants/sale/exchangeManagement/index";

import { CHANGE_ORDER_STATUS_BY_FORCE } from "@graphql/mutations/changeOrderStatusByForce";
import { GET_EXCHANGE_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";

import {
  ChangeOrderStatusByForceInputType,
  ChangeOrderStatusByForceType,
  ResetOrderItemType,
} from "@models/sale";
import {
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";

import { getIsCheckedStatus } from "@utils/sale";
import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";
import getDescription from "@utils/sale/exchange/getDescription";
import { getHandleCompleteRefundErrorCase } from "@utils/sale/refund";

import questionMarkSrc from "@icons/questionmark.svg";
import exclamationmarkSrc from "@icons/exclamationmark.svg";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";

import ControllerContainer from "@components/sale/ControllerContainer";
import Button from "@components/common/Button";
import { SelectInput, OptionInput } from "@components/common/input/Dropdown";
import { Input as SearchInput } from "@components/common/input/SearchInput";
import HandleRefusalRefundOrExchangeRequestModal from "@components/sale/HandleRefusalRefundOrExchangeRequestModal";
import HandleCompleteRefundModal from "@components/sale/refundManagement/HandleCompleteRefundModal";
import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/exchangeManagement/table";
import ExportToExcelButton from "@components/sale/ExportToExcelButton";

const Controller = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);
  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const checkedOrderItems: Array<ResetOrderItemType> =
    useReactiveVar(checkedOrderItemsVar);
  const reconstructCheckedOrderItems: Array<ResetOrderItemType> =
    getReconstructCheckedOrderItems(checkedOrderItems);

  const [changeOrderStatusByForce] = useMutation<
    ChangeOrderStatusByForceType,
    {
      input: ChangeOrderStatusByForceInputType;
    }
  >(CHANGE_ORDER_STATUS_BY_FORCE, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_EXCHANGE_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.EXCHANGE,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [sendOrderItems] = useMutation<
    SendOrderItemsType,
    {
      input: SendOrderItemsInputType;
    }
  >(SEND_ORDER_ITEMS, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    refetchQueries: [
      {
        query: GET_EXCHANGE_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.EXCHANGE,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const {
    isExchangeRequestChecked,
    isPickupInProgressChecked,
    isPickupCompletedChecked,
    isShippingAgainChecked,
    isExchangeCompletedChecked,
  } = getIsCheckedStatus(reconstructCheckedOrderItems);

  const handleSendButtonClick = (sendType: SendType) => () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    const isImPossibleExchangePickupStatus =
      sendType === SendType.EXCHANGE_PICK_UP &&
      (isPickupInProgressChecked ||
        isPickupCompletedChecked ||
        isShippingAgainChecked ||
        isExchangeCompletedChecked);

    const isImpossibleExchangeResendStatus =
      sendType === SendType.EXCHANGE_RESEND &&
      (isExchangeRequestChecked ||
        isPickupInProgressChecked ||
        isShippingAgainChecked ||
        isExchangeCompletedChecked);

    if (isImPossibleExchangePickupStatus || isImpossibleExchangeResendStatus) {
      showHasAnyProblemModal(
        <>
          ?????? ????????? ????????????
          <br />
          ???????????? ????????? ??? ????????????.
          <br />
          ?????? ????????? ?????? ??????????????????.
        </>
      );

      return;
    }

    const {
      isPickupShipmentCompanyFilled,
      isPickupShipmentNumberFilled,
      isPickupAgainShipmentCompanyFilled,
      isPickupAgainShipmentNumberFilled,
    } = reconstructCheckedOrderItems.reduce(
      (
        result,
        {
          temporaryPickupShipmentCompany,
          temporaryPickupShipmentNumber,
          temporaryPickupAgainShipmentCompany,
          temporaryPickupAgainShipmentNumber,
        }
      ) => {
        if (!temporaryPickupShipmentCompany)
          result.isPickupShipmentCompanyFilled = false;

        if (!temporaryPickupShipmentNumber)
          result.isPickupShipmentNumberFilled = false;

        if (!temporaryPickupAgainShipmentCompany)
          result.isPickupAgainShipmentCompanyFilled = false;

        if (!temporaryPickupAgainShipmentNumber)
          result.isPickupAgainShipmentNumberFilled = false;

        return result;
      },
      {
        isPickupShipmentCompanyFilled: true,
        isPickupShipmentNumberFilled: true,
        isPickupAgainShipmentCompanyFilled: true,
        isPickupAgainShipmentNumberFilled: true,
      }
    );

    const isExchangePickupInputNotFilled =
      sendType === SendType.EXCHANGE_PICK_UP &&
      (!isPickupShipmentCompanyFilled || !isPickupShipmentNumberFilled);

    const isExchangeReSendInputNotFilled =
      sendType === SendType.EXCHANGE_RESEND &&
      (!isPickupAgainShipmentCompanyFilled ||
        !isPickupAgainShipmentNumberFilled);

    if (isExchangePickupInputNotFilled || isExchangeReSendInputNotFilled) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        icon: exclamationmarkSrc,
        description: <>??????????????? ??????????????????</>,
        cancelButtonVisibility: false,
        confirmButtonVisibility: true,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
            icon: "",
          });
        },
      });

      return;
    }

    const sendTypeStatus =
      sendType === SendType.EXCHANGE_PICK_UP ? "??????" : "?????????";

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          ?????? ???????????? <br />
          {sendTypeStatus} ?????? ???????????????????
        </>
      ),
      cancelButtonVisibility: true,
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          void (async () => {
            loadingSpinnerVisibilityVar(true);

            const components =
              sendType === SendType.EXCHANGE_PICK_UP
                ? reconstructCheckedOrderItems.map(
                    ({
                      id,
                      temporaryPickupShipmentCompany,
                      temporaryPickupAgainShipmentNumber,
                    }) => ({
                      orderItemId: id,
                      shipmentCompany: temporaryPickupShipmentCompany,
                      shipmentNumber: String(
                        temporaryPickupAgainShipmentNumber
                      ),
                    })
                  )
                : reconstructCheckedOrderItems.map(
                    ({
                      id,
                      temporaryPickupAgainShipmentCompany,
                      temporaryPickupAgainShipmentNumber,
                    }) => ({
                      orderItemId: id,
                      shipmentCompany: temporaryPickupAgainShipmentCompany,
                      shipmentNumber: String(
                        temporaryPickupAgainShipmentNumber
                      ),
                    })
                  );

            const {
              data: {
                sendOrderItems: { ok, error },
              },
            } = await sendOrderItems({
              variables: {
                input: {
                  components: components,
                  type: sendType,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>{sendTypeStatus} ?????????????????????.</>,
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
              showHasServerErrorModal(error, `${sendTypeStatus} ??????`);
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, `${sendTypeStatus} ??????`);
        }
      },
    });
  };

  const handleRefusalExchangeButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (
      isPickupInProgressChecked ||
      isShippingAgainChecked ||
      isExchangeCompletedChecked
    ) {
      showHasAnyProblemModal(
        <>
          ?????? ????????? ????????????
          <br />
          ???????????? ????????? ??? ????????????.
          <br />
          ?????? ????????? ?????? ??????????????????.
        </>
      );

      return;
    }

    if (isPickupCompletedChecked) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            ?????? ????????? ???????????? <br />
            ?????? ????????? ???????????? ???????????????.
            <br />
            ?????? ?????? ?????????????????????????
          </>
        ),
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        confirmButtonClickHandler: () => {
          const {
            hasDiffrentOrder,
            hasDifferentShipmentType,
            hasDifferentCause,
          } = getHandleCompleteRefundErrorCase(reconstructCheckedOrderItems);

          if (hasDiffrentOrder) {
            showHasAnyProblemModal(
              <>
                ?????? ??????????????? ?????????
                <br />
                ????????? ???????????? ???????????????.
              </>
            );

            return;
          }

          if (hasDifferentShipmentType) {
            showHasAnyProblemModal(
              <>
                ?????? ??????????????? ?????????
                <br />
                ?????? ?????? ???????????? ???????????????.
              </>
            );

            return;
          }

          if (hasDifferentCause) {
            showHasAnyProblemModal(
              <>
                ?????? ??????????????? ?????????
                <br />
                ???????????? ????????? ???????????????.
              </>
            );

            return;
          }

          const checkedOrderItemIds = reconstructCheckedOrderItems.map(
            ({ id }) => id
          );
          const detailedReason = reconstructCheckedOrderItems.map(
            ({ detailedReason }) => detailedReason
          );
          const cause = reconstructCheckedOrderItems.map(({ cause }) => cause);
          const orderByShopId = reconstructCheckedOrderItems.map(
            ({ orderByShopId }) => orderByShopId
          );

          modalVar({
            isVisible: true,
            component: (
              <HandleCompleteRefundModal
                type={OrderStatusGroup.EXCHANGE}
                orderItemIds={checkedOrderItemIds}
                orderByShopId={orderByShopId[0]}
                cause={cause[0]}
                detailedReason={detailedReason[0]}
              />
            ),
          });
        },
      });

      return;
    }

    modalVar({
      isVisible: true,
      component: (
        <HandleRefusalRefundOrExchangeRequestModal
          status={DenyRefundOrExchangeRequestType.EXCHANGE}
        />
      ),
    });
  };

  const handleOrderStatusByForceClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          ????????? ???????????? ????????????
          <br />
          ???????????? ??????????????????
        </>
      );
      return;
    }

    if (isShippingAgainChecked || isExchangeCompletedChecked) {
      showHasAnyProblemModal(
        <>
          ?????? ????????? ????????????
          <br />
          ???????????? ????????? ??? ????????????.
          <br />
          ?????? ????????? ?????? ??????????????????.
        </>
      );
      return;
    }
  };

  const changeOrderStatusByForceHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const claimStatus = e.target.value as OrderStatusName;

    if (isExchangeCompletedChecked) {
      showHasAnyProblemModal(
        <>
          ?????? ????????? ????????????
          <br />
          ???????????? ????????? ??? ????????????.
          <br />
          ?????? ????????? ?????? ??????????????????.
        </>
      );
      return;
    }

    if (
      (claimStatus === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS &&
        isPickupInProgressChecked) ||
      (claimStatus === OrderStatusName.EXCHANGE_COMPLETED &&
        isPickupCompletedChecked) ||
      (claimStatus === OrderStatusName.SHIPPING_AGAIN && isShippingAgainChecked)
    ) {
      showHasAnyProblemModal(
        <>
          ????????? ?????? ???????????????
          <br />
          ????????? ??? ????????????.
          <br />
          ?????? ??????????????? ?????????
          <br />
          ??????????????????.
        </>
      );
      return;
    }

    if (
      (claimStatus === OrderStatusName.EXCHANGE_COMPLETED &&
        isExchangeCompletedChecked) ||
      (claimStatus === OrderStatusName.SHIPPING_AGAIN &&
        (isPickupInProgressChecked || isPickupCompletedChecked))
    ) {
      showHasAnyProblemModal(
        <>
          ?????? ?????? ????????????
          <br />
          ?????? ????????? ????????? ??? ????????????.
          <br />
          ?????? ??????????????? ?????????
          <br />
          ??????????????????.
        </>
      );
      return;
    }

    const description = getDescription(
      getIsCheckedStatus(reconstructCheckedOrderItems),
      claimStatus
    );

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description,
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          void (async () => {
            loadingSpinnerVisibilityVar(true);
            const components = reconstructCheckedOrderItems.map(({ id }) => ({
              orderItemId: id,
            }));

            const {
              data: {
                changeOrderStatusByForce: { ok, error },
              },
            } = await changeOrderStatusByForce({
              variables: {
                input: {
                  components,
                  claimStatusName: claimStatus,
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
                    "{orderStatusNameType[claimStatus] as string}" ?????????
                    ?????????????????????.
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
              showHasServerErrorModal(error, "?????? ?????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "?????? ?????? ??????");
        }
      },
      cancelButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>?????? ?????? ????????? ?????????????????????</>,
          confirmButtonVisibility: true,
          cancelButtonVisibility: false,
          confirmButtonClickHandler: () => {
            systemModalVar({
              ...systemModalVar(),
              isVisible: false,
            });
          },
        });
      },
    });
  };

  const changeSearchTypeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderSearchType;

    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      orderSearchType: type,
    });
  };

  const changeFilterQueryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemporaryQuery(e.target.value);
  };

  const changeSkipQuantityHandler = ({ target: { value } }) => {
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
      skip: Number(value),
    });

    paginationSkipVar(0);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return commonFilterOptionVar({
        ...commonFilterOptionVar(),
        query: temporaryQuery,
      });
    }, 500);

    return () => clearTimeout(debounce);
  }, [temporaryQuery]);

  return (
    <ControllerContainer>
      <ActiveButtonContainer>
        <ControlButton
          size="small"
          disabled={
            decryptSaleNameId[nameId] ===
              OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] ===
              OrderStatusName.EXCHANGE_PICK_UP_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_AGAIN ||
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_COMPLETED
          }
          onClick={handleSendButtonClick(SendType.EXCHANGE_PICK_UP)}
        >
          ??????
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleSendButtonClick(SendType.EXCHANGE_RESEND)}
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_REQUEST ||
            decryptSaleNameId[nameId] ===
              OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_AGAIN ||
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_COMPLETED
          }
        >
          ?????? ?????????
        </ControlButton>

        <ControlButton
          size="small"
          onClick={handleRefusalExchangeButtonClick}
          disabled={
            decryptSaleNameId[nameId] ===
              OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_AGAIN ||
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_COMPLETED
          }
        >
          ?????? ??????
        </ControlButton>

        <ChangeOrderStatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={OrderStatusName.DEFAULT}
          onClick={handleOrderStatusByForceClick}
          onChange={changeOrderStatusByForceHandler}
        >
          {changeOrderStatusType.map(({ id, label, value }) => (
            <Option
              value={value}
              key={id}
              hidden={value === OrderStatusName.DEFAULT}
            >
              {label}
            </Option>
          ))}
        </ChangeOrderStatusDropDown>

        <QuestionMarkIconContainer>
          <QuestionMarkIcon src={questionMarkSrc} />
          <NoticeCOntainer className={"notice"}>
            <NoticeIcon src={questionMarkSrc} />
            <NoticeText>
              ?????? ?????? ????????? ????????? ???????????? ?????? ???????????? ?????? ???????????????.
              <br /> ?????? ????????? ????????? ???????????????.
            </NoticeText>
          </NoticeCOntainer>
        </QuestionMarkIconContainer>
      </ActiveButtonContainer>
      <FilterContainer>
        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={orderSearchType}
          onChange={changeSearchTypeHandler}
        >
          {searchQueryType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </Select>
        <SearchQueryInput
          onChange={changeFilterQueryHandler}
          value={temporaryQuery}
        />

        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          defaultValue={20}
          onChange={changeSkipQuantityHandler}
        >
          {skipQuantityType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </Select>

        <ExportToExcelButton
          exportData={checkedOrderItems}
          tableData={[...fixTableType, ...scrollTableType]}
          status={OrderStatusGroup.EXCHANGE}
        >
          ????????????
        </ExportToExcelButton>
      </FilterContainer>
    </ControllerContainer>
  );
};

const ActiveButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
`;

const ChangeOrderStatusDropDown = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 7px;
`;

const Select = styled(SelectInput)`
  padding-right: 0px;
  margin-right: 12px;
`;

const Option = styled(OptionInput)``;

const SearchQueryInput = styled(SearchInput)`
  margin-right: 12px;
`;

const QuestionMarkIconContainer = styled.div`
  position: relative;

  &:hover .notice {
    display: flex;
  }
`;

const QuestionMarkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const NoticeCOntainer = styled.div`
  position: absolute;
  top: -100%;
  transform: translateY(-50%);

  z-index: 10;

  display: none;
  width: 397px;
  padding: 8px 16px 8px 8px;
  border-radius: 7px;
  background: ${({ theme: { palette } }) => palette.grey400};
`;

const NoticeText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const NoticeIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 15px;

  user-select: none;
`;

export default Controller;
