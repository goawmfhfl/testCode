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
import useLazyExchangeOrders from "@hooks/order/useLazyExchangeOrders";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";
import { getOrdersLength } from "@utils/sale";

const FilterBar = () => {
  const { getOrders, data } = useLazyExchangeOrders();
  const { statusName } = useReactiveVar(commonSaleFilterOptionVar);
  const totalPageLength = useReactiveVar(totalPageLengthVar);

  const orders = data?.getOrdersBySeller.totalOrderItems || [];

  const {
    exchangeReqeust,
    exchangePickupInProgress,
    exchangePickupCompleted,
    shippingAgain,
    exchangeCompleted,
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
        });
      }

      if (filterOptionName) {
        commonSaleFilterOptionVar({
          ...commonSaleFilterOptionVar(),
          statusName: filterOptionName,
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
            statusGroup: OrderStatusGroup.EXCHANGE,
          },
        },
        fetchPolicy: "no-cache",
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
        {exchangeReqeust +
          exchangePickupInProgress +
          exchangePickupCompleted +
          shippingAgain +
          exchangeCompleted}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.EXCHANGE_REQUEST}
        onClick={handleFilterOptionNameClick(OrderStatusName.EXCHANGE_REQUEST)}
      >
        교환요청 {exchangeReqeust}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.EXCHANGE_PICK_UP_IN_PROGRESS
        )}
      >
        수거중 {exchangePickupInProgress}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.EXCHANGE_PICK_UP_COMPLETED}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.EXCHANGE_PICK_UP_COMPLETED
        )}
      >
        수거완료 {exchangePickupCompleted}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.SHIPPING_AGAIN}
        onClick={handleFilterOptionNameClick(OrderStatusName.SHIPPING_AGAIN)}
      >
        재발송 {shippingAgain}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.EXCHANGE_COMPLETED}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.EXCHANGE_COMPLETED
        )}
      >
        교환완료 {exchangeCompleted}
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
