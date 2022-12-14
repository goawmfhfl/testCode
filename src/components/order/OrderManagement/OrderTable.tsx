import { useEffect, useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { TableType } from "@models/index";

import {
  fixedTableType,
  scrollTableType,
  orderCodeType,
  orderProductType,
  orderStatusType,
  PAYMENT_DAY,
  recipientType,
  sellerType,
  shipmentType,
  tableWidth,
} from "@constants/order/orderManagement";

import useLazyOrders from "@hooks/order/useLazyOrders";

import {
  FixedTable,
  ScrollTable,
  TableContainer,
  TdContainer,
  Td,
  Th,
  ThContainer,
  Tr,
} from "@components/common/table/Table";
import Checkbox from "@components/common/input/Checkbox";
import NoDataContainer from "@components/common/table/NoDataContainer";
import { filterOptionVar } from "@cache/order/orderManagement";
import {
  commonFilterOptionVar,
  systemModalVar,
  totalPageLengthVar,
} from "@cache/index";

import {
  NormalizedListType,
  caculatedOrderItemType,
} from "@models/order/orderManagement";

import caculateOrderItem from "@utils/order/caculateOrderItem";
import contructOrderItem from "@utils/order/contructOrderItem";
import {
  checkAllBoxStatusVar,
  pageNumberListVar,
  paginationVisibilityVar,
} from "@cache/index";
import { checkedOrderIdsVar } from "@cache/order";
import { OrderItemsType } from "@graphql/queries/getOrdersBySeller";
import Loading from "@components/common/table/Loading";

const OrderTable = () => {
  const { getOrderItem, error, loading, data } = useLazyOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const [orderItems, setOrderItems] = useState<Array<caculatedOrderItemType>>(
    []
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getOrderItem({
        variables: {
          input: {
            page,
            skip,
            query,
            type,
            statusName,
            statusType,
            statusGroup,
          },
        },
      });
    })();
  }, [page, skip, query, type, statusName, statusType, statusGroup]);

  useEffect(() => {
    if (!data || !data.getOrdersBySeller) return;

    const {
      totalPages,
      totalResults,
      totalOrderItems,
    }: {
      totalPages: number;
      totalResults: number;
      totalOrderItems: Array<OrderItemsType>;
    } = data.getOrdersBySeller;

    const isLastPageChanged = totalPages < page;

    if (isLastPageChanged && totalPages !== 0) {
      commonFilterOptionVar({
        ...commonFilterOptionVar(),
        page: totalPages,
      });

      return;
    }

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );

    totalPageLengthVar(totalResults);

    const nomalizedOrderItem: NormalizedListType =
      contructOrderItem(totalOrderItems);

    const caculatedOrderItem: Array<caculatedOrderItemType> =
      caculateOrderItem(nomalizedOrderItem);
    setOrderItems(caculatedOrderItem);

    checkedOrderIdsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading]);

  useEffect(() => {
    if (error) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            내부 서버 오류로 인해 요청하신
            <br />
            작업을 완료하지 못했습니다.
            <br />
            다시 한 번 시도 후 같은 문제가 발생할 경우
            <br />
            찹스틱스로 문의해주세요.
            <br />
            <br />
            (전화 문의 070-4187-3848)
            <br />
            <br />
            code:
            {error.message}
          </>
        ),
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  }, [error]);

  const hasOrderItems = !loading && !error && !!orderItems?.length;

  return (
    <TableContainer type={TableType.SCROLL} hasData={hasOrderItems}>
      <FixedTable width={tableWidth.left}>
        <ThContainer>
          <Th width={fixedTableType[0].width}>
            <Checkbox />
          </Th>
          <Th width={fixedTableType[1].width}>
            {orderCodeType.MERCHANTITEM_UID}
          </Th>
          <Th width={fixedTableType[2].width}>{orderCodeType.PRODUCT_CODE}</Th>
          <Th width={fixedTableType[3].width}>
            {orderProductType.ORDER_PRODUCT}
          </Th>
          <Th width={fixedTableType[4].width}>{sellerType.NAME}</Th>
          <Th width={fixedTableType[5].width}>{orderStatusType.ORDER}</Th>
        </ThContainer>
        <TdContainer>
          {hasOrderItems &&
            orderItems.map(
              ({
                orderId,
                merchantitemUid,
                productCode,
                orderProduct,
                sellerName,
                orderState,
              }) => (
                <Tr key={orderId}>
                  <Td width={fixedTableType[0].width}>
                    <Checkbox />
                  </Td>
                  <Td width={fixedTableType[1].width}>{merchantitemUid}</Td>
                  <Td width={fixedTableType[2].width}>{productCode}</Td>
                  <Td width={fixedTableType[3].width}>{orderProduct}</Td>
                  <Td width={fixedTableType[4].width}>{sellerName}</Td>
                  <Td width={fixedTableType[5].width}>{orderState}</Td>
                </Tr>
              )
            )}
        </TdContainer>
      </FixedTable>
      <ScrollTable width={tableWidth.right}>
        <ThContainer>
          <Th width={scrollTableType[0].width}>{orderStatusType.CLAIM}</Th>
          <Th width={scrollTableType[1].width}>{shipmentType.COURIER}</Th>
          <Th width={scrollTableType[2].width}>
            {shipmentType.INVOICE_NUMBER}
          </Th>
          <Th width={scrollTableType[3].width}>{PAYMENT_DAY}</Th>
          <Th width={scrollTableType[4].width}>{recipientType.NAME}</Th>
          <Th width={scrollTableType[5].width}>{recipientType.PHONE_NUMBER}</Th>

          <Th width={scrollTableType[6].width}>{recipientType.ADDRESS}</Th>

          <Th width={scrollTableType[7].width}>{recipientType.POST_CODE}</Th>

          <Th width={scrollTableType[8].width}>
            {recipientType.SHIPMENT_MEMO}
          </Th>
          <Th width={scrollTableType[9].width}>{sellerType.ID}</Th>
          <Th width={scrollTableType[10].width}>{sellerType.PHONE_NUMBER}</Th>
          <Th width={scrollTableType[11].width}>{orderProductType.OPTION}</Th>
          <Th width={scrollTableType[12].width}>{orderProductType.QUANTITY}</Th>
          <Th width={scrollTableType[13].width}>{orderProductType.PRICE}</Th>
          <Th width={scrollTableType[14].width}>
            {orderProductType.OPTION_PRICE}
          </Th>
          <Th width={scrollTableType[15].width}>
            {orderProductType.TOTAL_PRICE}
          </Th>
          <Th width={scrollTableType[16].width}>
            {shipmentType.SHIPMENT_PRICE}
          </Th>
          <Th width={scrollTableType[17].width}>
            {shipmentType.SHIPMENT_DISTANT_PRICE}
          </Th>
        </ThContainer>

        <TdContainer>
          {hasOrderItems &&
            orderItems.map(
              ({
                orderId,
                claimState,
                courier,
                invoiceNumber,
                paymentDay,
                recipientName,
                recipientPhoneNumber,
                address,
                postCode,
                shipmentMemo,
                sellerId,
                sellerPhoneNumber,
                option,
                quantity,
                price,
                optionPrice,
                totalPrice,
                shipmentPrice,
                shipmentDistantPrice,
              }) => (
                <Tr key={orderId}>
                  <Td width={scrollTableType[0].width}>{claimState}</Td>
                  <Td width={scrollTableType[1].width}>{courier}</Td>
                  <Td width={scrollTableType[2].width}>{invoiceNumber}</Td>
                  <Td width={scrollTableType[3].width}>{paymentDay}</Td>
                  <Td width={scrollTableType[4].width}>{recipientName}</Td>
                  <Td width={scrollTableType[5].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td width={scrollTableType[6].width}>{address}</Td>
                  <Td width={scrollTableType[7].width}>{postCode}</Td>
                  <Td width={scrollTableType[8].width}>{shipmentMemo}</Td>
                  <Td width={scrollTableType[9].width}>{sellerId}</Td>
                  <Td width={scrollTableType[10].width}>{sellerPhoneNumber}</Td>
                  <Td width={scrollTableType[11].width}>{option}</Td>
                  <Td width={scrollTableType[12].width}>{quantity}</Td>
                  <Td width={scrollTableType[13].width}>{price}</Td>
                  <Td width={scrollTableType[14].width}>{optionPrice}</Td>
                  <Td width={scrollTableType[15].width}>{totalPrice}</Td>
                  <Td width={scrollTableType[16].width}>{shipmentPrice}</Td>
                  <Td width={scrollTableType[17].width}>
                    {shipmentDistantPrice}
                  </Td>
                </Tr>
              )
            )}
        </TdContainer>
      </ScrollTable>

      {orderItems?.length === 0 && !loading && (
        <NoDataContainer type={TableType.SCROLL}>
          {query && (
            <>
              검색어와 일치하는
              <br />
              주문이 없습니다.
            </>
          )}

          {!query && (
            <>
              아직 들어온
              <br />
              주문이 없습니다.
            </>
          )}
        </NoDataContainer>
      )}

      {loading && <Loading type={TableType.SCROLL} />}
    </TableContainer>
  );
};

export default OrderTable;
