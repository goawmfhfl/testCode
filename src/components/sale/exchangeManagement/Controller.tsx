import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import {
  commonCheckedOrderItemsVar,
  commonSaleFilterOptionVar,
  totalOrderItemsVar,
} from "@cache/sale";
import {
  checkAllBoxStatusVar,
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
  OrderStatusName,
  orderStatusNameType,
  searchQueryType,
  SendType,
} from "@constants/sale";
import { skipQuantityType } from "@constants/index";
import { changeOrderStatusType } from "@constants/sale/exchangeManagement/index";

import { CHANGE_ORDER_STATUS_BY_FORCE } from "@graphql/mutations/changeOrderStatusByForce";
import { GET_EXCHANGE_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";
import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";

import {
  ChangeOrderStatusByForceInputType,
  ChangeOrderStatusByForceType,
  OrderItems,
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

const Controller = () => {
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } = useReactiveVar(
    commonSaleFilterOptionVar
  );
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");
  const checkAllBoxStatus = useReactiveVar(checkAllBoxStatusVar);

  const checkedOrderItems: Array<ResetOrderItemType> = useReactiveVar(
    commonCheckedOrderItemsVar
  );
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
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
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
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
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
        description: <>송장정보를 기입해주세요</>,
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
      sendType === SendType.EXCHANGE_PICK_UP ? "발송" : "재발송";

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          해당 교환건을 <br />
          {sendTypeStatus} 처리 하시겠습니까?
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
                      shipmentNumber: Number(
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
                      shipmentNumber: Number(
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
                description: <>{sendTypeStatus} 처리되었습니다.</>,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                confirmButtonClickHandler: () => {
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
              showHasServerErrorModal(error, `${sendTypeStatus} 처리`);
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, `${sendTypeStatus} 처리`);
        }
      },
    });
  };

  const handleRefusalExchangeButtonClick = () => {
    if (!checkedOrderItems.length) {
      showHasAnyProblemModal(
        <>
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
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
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
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
            수거 완료된 교환건의 <br />
            교환 거절은 반품으로 처리됩니다.
            <br />
            반품 완료 처리하시겠습니까?
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

          const checkedOrderItemIds = reconstructCheckedOrderItems.map(
            ({ id }) => id
          );
          const detailedReason = reconstructCheckedOrderItems.map(
            ({ detailedReason }) => detailedReason
          );
          const cause = reconstructCheckedOrderItems.map(({ cause }) => cause);

          modalVar({
            isVisible: true,
            component: (
              <HandleCompleteRefundModal
                orderItemIds={checkedOrderItemIds}
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
          선택된 주문건이 없습니다
          <br />
          주문건을 선택해주세요
        </>
      );
      return;
    }

    if (isShippingAgainChecked || isExchangeCompletedChecked) {
      showHasAnyProblemModal(
        <>
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
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
          해당 버튼은 선택하신
          <br />
          주문건을 처리할 수 없습니다.
          <br />
          주문 상태를 다시 확인해주세요.
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
          현재와 같은 주문상태로
          <br />
          변경할 수 없습니다.
          <br />
          다른 주문상태로 변경을
          <br />
          선택해주세요.
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
          현재 주문 상태보다
          <br />
          이전 상태로 돌아갈 수 없습니다.
          <br />
          다른 주문상태로 변경을
          <br />
          선택해주세요.
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
                  orderStatusName: claimStatus,
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
                    "{orderStatusNameType[claimStatus] as string}" 상태로
                    변경되었습니다.
                  </>
                ),
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                confirmButtonClickHandler: () => {
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
              showHasServerErrorModal(error, "강제 상태 변경");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "강제 상태 변경");
        }
      },
      cancelButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: <>주문 상태 변경이 취소되었습니다</>,
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

    commonSaleFilterOptionVar({
      ...commonSaleFilterOptionVar(),
      type,
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
            statusName === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            statusName === OrderStatusName.EXCHANGE_PICK_UP_COMPLETED ||
            statusName === OrderStatusName.SHIPPING_AGAIN ||
            statusName === OrderStatusName.EXCHANGE_COMPLETED
          }
          onClick={handleSendButtonClick(SendType.EXCHANGE_PICK_UP)}
        >
          수거
        </ControlButton>
        <ControlButton
          size="small"
          onClick={handleSendButtonClick(SendType.EXCHANGE_RESEND)}
          disabled={
            statusName === OrderStatusName.EXCHANGE_REQUEST ||
            statusName === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            statusName === OrderStatusName.SHIPPING_AGAIN ||
            statusName === OrderStatusName.EXCHANGE_COMPLETED
          }
        >
          교환 재발송
        </ControlButton>

        <ControlButton
          size="small"
          onClick={handleRefusalExchangeButtonClick}
          disabled={
            statusName === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS ||
            statusName === OrderStatusName.SHIPPING_AGAIN ||
            statusName === OrderStatusName.EXCHANGE_COMPLETED
          }
        >
          교환 거절
        </ControlButton>

        <ChangeOrderStatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
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
              강제 상태 변경은 선택한 주문상태 이후 상태로만 변경 가능합니다.
              <br /> 이전 상태로 변경은 불가합니다.
            </NoticeText>
          </NoticeCOntainer>
        </QuestionMarkIconContainer>
      </ActiveButtonContainer>
      <FilterContainer>
        <Select
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={type}
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

        <Button size={"small"}>내보내기</Button>
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
