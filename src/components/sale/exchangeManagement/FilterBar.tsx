import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";

import { OrderStatusGroup, OrderStatusName } from "@constants/sale";
import { Pathnames, decryptSaleNameId } from "@constants/index";

import useLazyExchangeOrders from "@hooks/order/useLazyExchangeOrders";
import { getOrdersLength } from "@utils/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";

const FilterBar = () => {
  const [searchParams] = useSearchParams();
  const { nameId } = Object.fromEntries([...searchParams]);

  const { getOrderItems, data } = useLazyExchangeOrders();
  const totalPageLength = useReactiveVar(totalPageLengthVar);

  const orders = data?.getOrdersBySeller.totalOrderItems || [];
  const {
    exchangeReqeust,
    exchangePickupInProgress,
    exchangePickupCompleted,
    shippingAgain,
    exchangeCompleted,
  } = getOrdersLength(orders);

  useEffect(() => {
    void (async () => {
      await getOrderItems({
        variables: {
          input: {
            page: 1,
            skip: null,
            query: null,
            type: null,
            statusName: null,
            statusType: null,
            statusGroup: OrderStatusGroup.EXCHANGE,
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
      button={<Button size={"small"}>전체 내역 내보내기</Button>}
      searchResultLength={totalPageLength}
    >
      <Link to={Pathnames.Exchange}>
        <Filter isActvie={!nameId}>
          전체{" "}
          {exchangeReqeust +
            exchangePickupInProgress +
            exchangePickupCompleted +
            shippingAgain +
            exchangeCompleted}
        </Filter>
      </Link>

      <Link to={Pathnames.ExchangeRequest}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_REQUEST
          }
        >
          교환요청 {exchangeReqeust}
        </Filter>
      </Link>

      <Link to={Pathnames.ExchangePickupInProgress}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] ===
            OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS
          }
        >
          수거중 {exchangePickupInProgress}
        </Filter>
      </Link>

      <Link to={Pathnames.ExchangePickupCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] ===
            OrderStatusName.EXCHANGE_PICK_UP_COMPLETED
          }
        >
          수거완료 {exchangePickupCompleted}
        </Filter>
      </Link>

      <Link to={Pathnames.ExchangeShippingAgain}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_AGAIN
          }
        >
          재발송 {shippingAgain}
        </Filter>
      </Link>

      <Link to={Pathnames.ExchangeCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.EXCHANGE_COMPLETED
          }
        >
          교환완료 {exchangeCompleted}
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
