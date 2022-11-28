import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";

import { filterOptionVar } from "@cache/order/orderManagement";
import { commonFilterOptionVar, paginationSkipVar } from "@cache/index";

import { orderStatusType } from "@constants/order/index";

import { OrderStatusName } from "@models/order/orderManagement";
import { OrderStatusType } from "@models/order/orderManagement";

import FilterBarContainer from "@components/order/FilterBarContainer";

const FilterBar = () => {
  const { statusName } = useReactiveVar(filterOptionVar);

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

  return (
    <FilterBarContainer>
      <Filter
        isActvie={statusName === null}
        onClick={handleFilterOptionNameClick(null)}
      >
        {orderStatusType.ALL}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PAYMENT_COMPLETED}
        onClick={handleFilterOptionNameClick(OrderStatusName.PAYMENT_COMPLETED)}
      >
        {orderStatusType.NEW}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PREPARING}
        onClick={handleFilterOptionNameClick(OrderStatusName.PREPARING)}
      >
        {orderStatusType.PREPARING}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.SHIPPING}
        onClick={handleFilterOptionNameClick(OrderStatusName.SHIPPING)}
      >
        {orderStatusType.SHIPPING}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.SHIPPING_COMPLETED}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.SHIPPING_COMPLETED
        )}
      >
        {orderStatusType.SHIPPING_COMPLETED}
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
