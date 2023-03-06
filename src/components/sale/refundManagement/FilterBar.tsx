import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";
import { decryptSaleNameId, Pathnames } from "@constants/index";
import { OrderStatusGroup, OrderStatusName } from "@constants/sale";

import useLazyRefundOrders from "@hooks/order/useLazyRefundOrders";
import { getOrdersLength } from "@utils/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import ExportToExcelButton from "@components/sale/refundManagement/ExportAllExcelButton";

const FilterBar = () => {
  const [searchParams] = useSearchParams();
  const { nameId } = Object.fromEntries([...searchParams]);

  const { data, getOrderItem } = useLazyRefundOrders();
  const totalPageLength = useReactiveVar(totalPageLengthVar);

  const orders = data?.getOrdersBySeller.totalOrderItems || [];

  const {
    refundRequest,
    refundPickUpInProgress,
    refundPickUpCompleted,
    refundCompleted,
  } = getOrdersLength(orders);

  useEffect(() => {
    void (async () => {
      await getOrderItem({
        variables: {
          input: {
            page: 1,
            skip: null,
            query: null,
            type: null,
            statusName: null,
            statusType: null,
            statusGroup: OrderStatusGroup.REFUND,
          },
        },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: true,
      });
    })();
  }, []);

  useEffect(() => {
    commonFilterOptionVar({
      ...commonFilterOptionVar(),
      page: 1,
    });
    paginationSkipVar(0);
  }, [searchParams]);

  return (
    <FilterBarContainer
      button={<ExportToExcelButton>전체 내역 내보내기</ExportToExcelButton>}
      searchResultLength={totalPageLength}
    >
      <Link to={Pathnames.Refund}>
        <Filter isActvie={!nameId}>
          전체{" "}
          {refundRequest +
            refundPickUpInProgress +
            refundPickUpCompleted +
            refundCompleted}
        </Filter>
      </Link>
      <Link to={Pathnames.RefundRequest}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_REQUEST
          }
        >
          반품요청 {refundRequest}
        </Filter>
      </Link>
      <Link to={Pathnames.RefundPickupInProgress}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] ===
            OrderStatusName.REFUND_PICK_UP_IN_PROGRESS
          }
        >
          수거중 {refundPickUpInProgress}
        </Filter>
      </Link>
      <Link to={Pathnames.RefundPickupCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] ===
            OrderStatusName.REFUND_PICK_UP_COMPLETED
          }
        >
          수거완료 {refundPickUpCompleted}
        </Filter>
      </Link>
      <Link to={Pathnames.RefundCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.REFUND_COMPLETED
          }
        >
          반품완료 {refundCompleted}
        </Filter>
      </Link>
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
