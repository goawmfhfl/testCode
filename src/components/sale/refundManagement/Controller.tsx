import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

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
import { decryptSaleNameId, decryptSaleTypeId } from "@constants/index";

import {
  OrderSearchType,
  searchQueryType,
  SendType,
  DenyRefundOrExchangeRequestType,
  OrderStatusName,
  Cause,
  OrderStatusType,
  OrderStatusGroup,
} from "@constants/sale";
import { skipQuantityType } from "@constants/index";
import { changeRefundOrderStatusByForceType } from "@constants/sale/refundManagement/index";
import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/refundManagement/table";

import { SEND_ORDER_ITEMS } from "@graphql/mutations/sendOrderItems";
import { CHANGE_ORDER_STATUS_BY_FORCE } from "@graphql/mutations/changeOrderStatusByForce";
import { GET_REFUND_ORDERS_BY_SELLER } from "@graphql/queries/getOrdersBySeller";

import {
  ChangeOrderStatusByForceType,
  ChangeOrderStatusByForceInputType,
  ResetOrderItemType,
  OrderItems,
} from "@models/sale";
import {
  SendOrderItemsInputType,
  SendOrderItemsType,
} from "@models/sale/order";

import getReconstructCheckedOrderItems from "@utils/sale/order/getReconstructCheckedOrderItems";
import { getIsCheckedStatus } from "@utils/sale";
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
import { checkedOrderItemsVar } from "@cache/sale";
import ExportToExcelButton from "components/sale/ExportToExcelButton";

const Controller = () => {
  const [searchParams] = useSearchParams();
  const { typeId, nameId } = Object.fromEntries([...searchParams]);

  const { page, skip, query, orderSearchType } = useReactiveVar(
    commonFilterOptionVar
  );

  const [changeOrderStatusByForce] = useMutation<
    ChangeOrderStatusByForceType,
    {
      input: ChangeOrderStatusByForceInputType;
    }
  >(CHANGE_ORDER_STATUS_BY_FORCE, {
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
            statusGroup: OrderStatusGroup.REFUND,
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
        query: GET_REFUND_ORDERS_BY_SELLER,
        variables: {
          input: {
            page,
            skip,
            query,
            type: orderSearchType,
            statusName: decryptSaleNameId[nameId] as OrderStatusName,
            statusType: decryptSaleTypeId[typeId] as OrderStatusType,
            statusGroup: OrderStatusGroup.REFUND,
          },
        },
      },
      "GetOrdersBySeller",
    ],
  });

  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [temporaryQuery, setTemporaryQuery] = useState<string>("");

  const checkedOrderItems = useReactiveVar(checkedOrderItemsVar);
  const reconstructCheckedOrderItems: Array<ResetOrderItemType> =
    getReconstructCheckedOrderItems(checkedOrderItems);
  const {
    isRefundRequestChecked,
    refundRequestCount,
    isPickupInProgressChecked,
    pickupInProgressCount,
    isPickupCompletedChecked,
    isRefundCompletedChecked,
  } = getIsCheckedStatus(reconstructCheckedOrderItems);

  const handleSendButtonClick = () => {
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
      isPickupCompletedChecked ||
      isRefundCompletedChecked
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

    const { isShipmentCompanyFullFilled, isShipmentNumberFullFilled } =
      reconstructCheckedOrderItems.reduce(
        (
          result,
          { temporaryRefundShipmentCompany, temporaryRefundShipmentNumber }
        ) => {
          if (!temporaryRefundShipmentCompany)
            result.isShipmentCompanyFullFilled = false;
          if (!temporaryRefundShipmentNumber)
            result.isShipmentCompanyFullFilled = false;

          return result;
        },
        {
          isShipmentCompanyFullFilled: true,
          isShipmentNumberFullFilled: true,
        }
      );

    if (!isShipmentCompanyFullFilled || !isShipmentNumberFullFilled) {
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          ?????? ???????????? <br />
          ?????? ?????? ???????????????????
        </>
      ),
      cancelButtonVisibility: true,
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        try {
          void (async () => {
            loadingSpinnerVisibilityVar(true);

            const components = reconstructCheckedOrderItems.map(
              ({
                id,
                temporaryRefundShipmentCompany,
                temporaryRefundShipmentNumber,
              }) => ({
                orderItemId: id,
                shipmentCompany: temporaryRefundShipmentCompany,
                shipmentNumber: String(temporaryRefundShipmentNumber),
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
                  type: SendType.REFUND_PICK_UP,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                description: <>?????? ?????????????????????.</>,
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
              showHasServerErrorModal(error, "?????? ??????");
            }
          })();
        } catch (error) {
          loadingSpinnerVisibilityVar(false);
          showHasServerErrorModal(error as string, "?????? ??????");
        }
      },
    });
  };

  const handleRefusalRefundButtonClick = () => {
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
      isPickupCompletedChecked ||
      isRefundCompletedChecked
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

    modalVar({
      isVisible: true,
      component: (
        <HandleRefusalRefundOrExchangeRequestModal
          status={DenyRefundOrExchangeRequestType.REFUND}
        />
      ),
    });
  };

  const handleCompleteRefundButtonClick = () => {
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
      isRefundRequestChecked ||
      isPickupInProgressChecked ||
      isRefundCompletedChecked
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

    const { hasDiffrentOrder, hasDifferentShipmentType, hasDifferentCause } =
      getHandleCompleteRefundErrorCase(reconstructCheckedOrderItems);

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

    if (isRefundCompletedChecked) {
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

    if (isRefundCompletedChecked) {
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
      (claimStatus === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS &&
        isPickupInProgressChecked) ||
      (claimStatus === OrderStatusName.REFUND_COMPLETED &&
        isPickupCompletedChecked)
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
      claimStatus === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS &&
      isPickupCompletedChecked
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

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          {isRefundRequestChecked && `???????????? ${refundRequestCount}???`}{" "}
          {isPickupInProgressChecked && `????????? ${pickupInProgressCount}???`}
          ???
          <br />
          {claimStatus === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS &&
            "???????????????"}
          {claimStatus === OrderStatusName.REFUND_COMPLETED && "???????????????"}{" "}
          ?????? ?????????????????????????
        </>
      ),
      confirmButtonVisibility: true,
      cancelButtonVisibility: true,
      confirmButtonClickHandler: () => {
        const description =
          claimStatus === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS
            ? "?????????"
            : "????????????";
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
                description: <>{description}????????? ?????????????????????.</>,
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
              OrderStatusName.REFUND_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] ===
              OrderStatusName.REFUND_PICK_UP_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_COMPLETED
          }
          onClick={handleSendButtonClick}
        >
          ??????
        </ControlButton>
        <ControlButton
          size="small"
          disabled={
            decryptSaleNameId[nameId] ===
              OrderStatusName.REFUND_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] ===
              OrderStatusName.REFUND_PICK_UP_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_COMPLETED
          }
          onClick={handleRefusalRefundButtonClick}
        >
          ?????? ??????
        </ControlButton>
        <ControlButton
          size="small"
          disabled={
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_REQUEST ||
            decryptSaleNameId[nameId] ===
              OrderStatusName.REFUND_PICK_UP_IN_PROGRESS ||
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_COMPLETED
          }
          onClick={handleCompleteRefundButtonClick}
        >
          ?????? ?????? ??????
        </ControlButton>
        <ChangeOrderStatusDropDown
          arrowSrc={triangleArrowSvg}
          sizing={"medium"}
          width={"119px"}
          value={OrderStatusName.DEFAULT}
          disabled={
            decryptSaleNameId[nameId] ===
              OrderStatusName.REFUND_PICK_UP_COMPLETED ||
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_COMPLETED
          }
          onChange={changeOrderStatusByForceHandler}
          onClick={handleOrderStatusByForceClick}
        >
          {changeRefundOrderStatusByForceType.map(({ id, label, value }) => (
            <Option value={value} key={id}>
              {label}
            </Option>
          ))}
        </ChangeOrderStatusDropDown>

        <QuestionMarkIconContainer>
          <QuestionMarkIcon
            src={questionMarkSrc}
            onMouseOver={() => setShowNotice(true)}
            onMouseLeave={() => setShowNotice(false)}
          />
          {showNotice && (
            <NoticeCOntainer>
              <NoticeIcon src={questionMarkSrc} />
              <NoticeText>
                ?????? ?????? ????????? ????????? ???????????? ?????? ???????????? ?????? ???????????????.
                <br /> ?????? ????????? ????????? ???????????????.
              </NoticeText>
            </NoticeCOntainer>
          )}
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
          status={OrderStatusGroup.REFUND}
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

  display: flex;
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
