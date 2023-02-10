import React, { useEffect } from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";

import { commonSaleFilterOptionVar } from "@cache/sale";
import {
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@constants/sale";
import useLazyRefundOrders from "@hooks/order/useLazyRefundOrders";
import { getOrdersLength } from "@utils/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";

const FilterBar = () => {
  const { data, getOrders } = useLazyRefundOrders();

  const { statusName } = useReactiveVar(commonSaleFilterOptionVar);
  const orders = data?.getOrdersBySeller.totalOrderItems || [];
  const totalPageLength = useReactiveVar(totalPageLengthVar);
  const {
    refundRequest,
    refundPickUpInProgress,
    refundPickUpCompleted,
    refundCompleted,
  } = getOrdersLength(orders);

  const handleFilterOptionNameClick =
    (filterOptionName: OrderStatusName) => () => {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: 1,
      });
      paginationSkipVar(0);

      if (!filterOptionName) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: null,
          statusType: OrderStatusType.CLAIM,
          statusGroup: OrderStatusGroup.REFUND,
        });
      }

      if (filterOptionName === OrderStatusName.REFUND_REQUEST) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: filterOptionName,
          statusType: OrderStatusType.CLAIM,
          statusGroup: OrderStatusGroup.REFUND,
        });
      }

      if (filterOptionName === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: filterOptionName,
          statusType: OrderStatusType.CLAIM,
          statusGroup: OrderStatusGroup.REFUND,
        });
      }

      if (filterOptionName === OrderStatusName.REFUND_PICK_UP_COMPLETED) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: filterOptionName,
          statusType: OrderStatusType.CLAIM,
          statusGroup: OrderStatusGroup.REFUND,
        });
      }

      if (filterOptionName === OrderStatusName.REFUND_COMPLETED) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: filterOptionName,
          statusType: OrderStatusType.CLAIM,
          statusGroup: OrderStatusGroup.REFUND,
        });
      }
    };

  useEffect(() => {
    void (async () => {
      await getOrders({
        variables: {
          input: {
            page: 1,
            skip: null,
            query: null,
            type: null,
            statusName: null,
            statusType: OrderStatusType.CLAIM,
            statusGroup: OrderStatusGroup.REFUND,
          },
        },
      });
    })();
  }, []);

  return (
    <FilterBarContainer
      button={<Button size={"small"}>전체 내역 내보내기</Button>}
      searchResultLength={totalPageLength}
    >
      <Filter
        isActvie={statusName === null}
        onClick={handleFilterOptionNameClick(null)}
      >
        전체{" "}
        {refundRequest +
          refundPickUpInProgress +
          refundPickUpCompleted +
          refundCompleted}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_REQUEST}
        onClick={handleFilterOptionNameClick(OrderStatusName.REFUND_REQUEST)}
      >
        반품요청 {refundRequest}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.REFUND_PICK_UP_IN_PROGRESS
        )}
      >
        수거중 {refundPickUpInProgress}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_PICK_UP_COMPLETED}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.REFUND_PICK_UP_COMPLETED
        )}
      >
        수거완료 {refundPickUpCompleted}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_COMPLETED}
        onClick={handleFilterOptionNameClick(OrderStatusName.REFUND_COMPLETED)}
      >
        반품완료 {refundCompleted}
      </Filter>
    </FilterBarContainer>
  );
};

const Filter = styled.li<{ isActvie: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 14px 56px;
  border-bottom: 1px solid
    ${({ theme: { palette }, isActvie }) =>
      isActvie ? palette.grey500 : "none"};

  cursor: pointer;
`;

export default FilterBar;
