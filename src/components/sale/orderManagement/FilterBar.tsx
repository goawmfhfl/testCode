import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import {
  commonFilterOptionVar,
  paginationSkipVar,
  totalPageLengthVar,
} from "@cache/index";
import { OrderStatusGroup, OrderStatusName } from "@constants/sale";
import { decryptSaleNameId, Pathnames } from "@constants/index";

import useLazyOrderStatus from "@hooks/order/useLazyOrderStatus";

import { getOrdersLength } from "@utils/sale/order/getOrdersLength";

import Button from "@components/common/Button";
import FilterBarContainer from "@components/sale/FilterBarContainer";
import ExportAllExcelButton from "@components/sale/orderManagement/ExportAllExcelButton";

const FilterBar = () => {
  const [searchParams] = useSearchParams();
  const { nameId } = Object.fromEntries([...searchParams]);

  const { data, getOrderStatus } = useLazyOrderStatus();
  const totalPageLength = useReactiveVar(totalPageLengthVar);
  const orders = data?.getOrdersBySeller.totalOrderItems || [];

  const { all, paymentCompleted, preparing, shipping, shippingCompleted } =
    getOrdersLength(orders);

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
            statusGroup: OrderStatusGroup.ORDER,
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
      <Link to={Pathnames.Order}>
        <Filter isActvie={!nameId}>전체 {all}</Filter>
      </Link>

      <Link to={Pathnames.OrderPaymentCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.PAYMENT_COMPLETED
          }
        >
          새주문 {paymentCompleted}
        </Filter>
      </Link>

      <Link to={Pathnames.OrderPreparing}>
        <Filter
          isActvie={decryptSaleNameId[nameId] === OrderStatusName.PREPARING}
        >
          상품준비중 {preparing}
        </Filter>
      </Link>

      <Link to={Pathnames.OrderShipping}>
        <Filter
          isActvie={decryptSaleNameId[nameId] === OrderStatusName.SHIPPING}
        >
          배송중 {shipping}
        </Filter>
      </Link>

      <Link to={Pathnames.OrderShippingCompleted}>
        <Filter
          isActvie={
            decryptSaleNameId[nameId] === OrderStatusName.SHIPPING_COMPLETED
          }
        >
          배송완료 {shippingCompleted}
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
