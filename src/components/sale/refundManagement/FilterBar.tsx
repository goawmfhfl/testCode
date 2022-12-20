import React from "react";
import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";
import { filterOptionVar } from "@cache/sale/refund";
import { OrderStatusName, OrderStatusType } from "@constants/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";

const FilterBar = () => {
  const { statusName } = useReactiveVar(filterOptionVar);
  const totalPageLength = useReactiveVar(totalPageLengthVar);

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
    <FilterBarContainer
      button={<Button size={"small"}>전체 내역 내보내기</Button>}
      searchResultLength={0}
    >
      <Filter
        isActvie={statusName === null}
        onClick={handleFilterOptionNameClick(null)}
      >
        전체
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_REQUEST}
        onClick={handleFilterOptionNameClick(OrderStatusName.REFUND_REQUEST)}
      >
        반품요청
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_PICK_UP_IN_PROGRESS}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.REFUND_PICK_UP_IN_PROGRESS
        )}
      >
        수거중
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_PICK_UP_COMPLETED}
        onClick={handleFilterOptionNameClick(
          OrderStatusName.REFUND_PICK_UP_COMPLETED
        )}
      >
        수거완료
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.REFUND_COMPLETED}
        onClick={handleFilterOptionNameClick(OrderStatusName.REFUND_COMPLETED)}
      >
        반품완료
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
