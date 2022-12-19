import { useEffect } from "react";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import { filterOptionVar } from "@cache/sale/order";
import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";

import useLazyOrderStatus from "@hooks/order/useLazyOrderStatus";

import {
  OrderStatusType,
  OrderStatusGroup,
  OrderStatusName,
} from "@constants/sale";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";
import { getOrdersLength } from "@utils/sale/cancel";

const FilterBar = () => {
  const { data, getOrderStatus } = useLazyOrderStatus();

  const { statusName } = useReactiveVar(filterOptionVar);
  const totalPageLength = useReactiveVar(totalPageLengthVar);
  const orders = data?.getOrdersBySeller.totalOrderItems || [];
  const { all, cancelRequest, cancelCompleted } = getOrdersLength(orders);

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
      await getOrderStatus({
        variables: {
          input: {
            page: 1,
            skip: null,
            query: null,
            type: null,
            statusName: null,
            statusType: null,
            statusGroup: OrderStatusGroup.CANCEL,
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
        전체 {all}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PAYMENT_COMPLETED}
        onClick={handleFilterOptionNameClick(OrderStatusName.PAYMENT_COMPLETED)}
      >
        취소요청 {cancelRequest}
      </Filter>
      <Filter
        isActvie={statusName === OrderStatusName.PREPARING}
        onClick={handleFilterOptionNameClick(OrderStatusName.PREPARING)}
      >
        취소완료 {cancelCompleted}
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
