import { useEffect } from "react";
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

import useLazyOrderStatus from "@hooks/order/useLazyOrderStatus";

import { getOrdersLength } from "@utils/sale/cancel";

import FilterBarContainer from "@components/sale/FilterBarContainer";
import Button from "@components/common/Button";
import ExportAllExcelButton from "@components/sale/cancelManagement/ExportAllExcelButton";

const FilterBar = () => {
  const [searchParams] = useSearchParams();
  const { nameId } = Object.fromEntries([...searchParams]);

  const { data, getOrderStatus } = useLazyOrderStatus();
  const totalPageLength = useReactiveVar(totalPageLengthVar);

  const orders = data?.getOrdersBySeller.totalOrderItems || [];
  const { all, cancelRequest, cancelCompleted } = getOrdersLength(orders);

  useEffect(() => {
    void (async () => {
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
      button={<ExportAllExcelButton>전체 내역 내보내기</ExportAllExcelButton>}
      searchResultLength={totalPageLength}
    >
      <Link to={Pathnames.Cancel}>
        <Filter isActvie={!nameId}>전체 {all}</Filter>
      </Link>

      <Link to={Pathnames.CancelReqeust}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.CANCEL_REQUEST
          }
        >
          취소요청 {cancelRequest}
        </Filter>
      </Link>

      <Link to={Pathnames.CancelCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.CANCEL_COMPLETED
          }
        >
          취소완료 {cancelCompleted}
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
