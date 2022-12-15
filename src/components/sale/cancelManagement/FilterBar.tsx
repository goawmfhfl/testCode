import { useEffect } from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import { filterOptionVar } from "@cache/sale/orderManagement";
import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";

import useLazyAllOrderStatus from "@hooks/order/useLazyAllOrderStatus";

import {
  OrderStatusType,
  OrderStatusGroup,
  OrderStatusName,
} from "@constants/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";

const FilterBar = () => {
  const { data, getAllOrderStatus } = useLazyAllOrderStatus();

  const { statusName } = useReactiveVar(filterOptionVar);
  const totalPageLength = useReactiveVar(totalPageLengthVar);
  const orders = data?.getOrdersBySeller.totalOrderItems || [];

  const ordersLength = {
    allOrders: orders.length,
    paymentCompleted: orders.filter(
      (list) => list.orderStatus.name === OrderStatusName.PAYMENT_COMPLETED
    ).length,
    preparing: orders.filter(
      (list) => list.orderStatus.name === OrderStatusName.PREPARING
    ).length,
    shipping: orders.filter(
      (list) => list.orderStatus.name === OrderStatusName.SHIPPING
    ).length,

    shippingCompleted: orders.filter(
      (list) => list.orderStatus.name === OrderStatusName.SHIPPING_COMPLETED
    ).length,
  };

  const {
    allOrders,
    paymentCompleted,
    preparing,
    shipping,
    shippingCompleted,
  } = ordersLength;

  const handleFilterOptionNameClick =
    (filterOptionName: OrderStatusName) => () => {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: 1,
      });
      paginationSkipVar(0);
      filterOptionVar({
        ...filterOptionVar(),
        statusName: filterOptionName,
        statusType: OrderStatusType.ORDER,
      });
    };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getAllOrderStatus({
        variables: {
          input: {
            page: 1,
            skip: null,
            query: null,
            type: null,
            statusName: null,
            statusType: null,
            statusGroup: OrderStatusGroup.ORDER,
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
        전체 {allOrders}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PAYMENT_COMPLETED}
        onClick={handleFilterOptionNameClick(OrderStatusName.PAYMENT_COMPLETED)}
      >
        취소요청 {paymentCompleted}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PREPARING}
        onClick={handleFilterOptionNameClick(OrderStatusName.PREPARING)}
      >
        취소완료 {preparing}
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
