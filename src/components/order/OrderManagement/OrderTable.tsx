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

import {
  OrderSearchType,
  OrderStatusGroup,
  OrderStatusName,
  OrderStatusType,
} from "@models/order/orderManagement";

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
import { commonFilterOptionVar } from "@cache/index";

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

const OrderTable = () => {
  const { getOrderItem, error, loading, data } = useLazyOrders();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { type, statusName, statusType, statusGroup } =
    useReactiveVar(filterOptionVar);

  const checkedOrderIds: Array<number> = useReactiveVar(checkedOrderIdsVar);
  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

  const [totalOrderItems, setTotalOrderItems] = useState<
    Array<caculatedOrderItemType>
  >([]);
  const [isCheckedList, setIsCheckedList] = useState<{
    [key: string]: { isChecked: boolean };
  }>({});

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsCheckedList = JSON.parse(JSON.stringify(isCheckedList)) as {
      [key: string]: { isChecked: boolean };
    };
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      Object.keys(newIsCheckedList).forEach((key) => {
        newIsCheckedList[key] = { isChecked: true };
      });

      const checkedProductIds = Object.keys(newIsCheckedList).map((id) =>
        Number(id)
      );

      checkedOrderIdsVar(checkedProductIds);
      setIsCheckedList(newIsCheckedList);
    }

    if (!e.target.checked) {
      Object.keys(newIsCheckedList).forEach((key) => {
        newIsCheckedList[key] = { isChecked: false };
      });

      checkedOrderIdsVar([]);
      setIsCheckedList(newIsCheckedList);
    }
  };

  const changeSingleCheckBoxHandler =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newIsCheckedList = JSON.parse(JSON.stringify(isCheckedList)) as {
        [key: string]: { isChecked: boolean };
      };

      if (e.target.checked) {
        newIsCheckedList[id].isChecked = true;
        setIsCheckedList(newIsCheckedList);
        checkedOrderIdsVar([...checkedOrderIds, id]);
      }

      if (!e.target.checked) {
        newIsCheckedList[id].isChecked = false;
        setIsCheckedList(newIsCheckedList);

        const isCheckedList = checkedOrderIds.filter(
          (selectedId) => selectedId === id
        );

        if (isCheckedList) {
          const checkedListIndex = checkedOrderIds.findIndex(
            (selectedId) => selectedId === id
          );

          checkedOrderIdsVar([
            ...checkedOrderIds.slice(0, checkedListIndex),
            ...checkedOrderIds.slice(checkedListIndex + 1),
          ]);
        }
      }
    };

  useEffect(() => {
    // need Check Because totalPages get null from Server GraphQl
    const totalPages: number = data?.getOrdersBySeller.totalPages || 1;
    const orderItems = data?.getOrdersBySeller.totalOrderItems || [];
    const nomalizedOrderItem: NormalizedListType =
      contructOrderItem(orderItems);

    const caculatedOrderItem: Array<caculatedOrderItemType> =
      caculateOrderItem(nomalizedOrderItem);

    const checkedList: {
      [key: string]: { isChecked: boolean };
    } =
      caculatedOrderItem?.reduce((acc, cur) => {
        acc[cur.orderId] = { isChecked: false };
        return acc;
      }, {}) || {};

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );

    setTotalOrderItems(caculatedOrderItem);
    setIsCheckedList(checkedList);
    checkedOrderIdsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading, error]);

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

  if (loading)
    return (
      <>
        loading...
        <br />
        로딩중 입니다..
        <br />* 로딩중 상태 추후 개발 예정
      </>
    );
  if (error)
    return (
      <>
        에러가 발생했습니다!!
        <br />
        * 에러 상태 추후 개발 예정
        <br />
        에러메세지: {error.message}
      </>
    );

  return (
    <TableContainer
      type={TableType.SCROLL}
      hasNoData={totalOrderItems?.length === 0}
    >
      <FixedTable width={tableWidth.left}>
        <ThContainer>
          <Th width={fixedTableType[0].width}>
            <Checkbox
              onChange={changeAllCheckBoxHandler}
              checked={checkAllBoxStatus}
            />
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
          {totalOrderItems.map(
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
                  <Checkbox
                    onChange={changeSingleCheckBoxHandler(orderId)}
                    checked={isCheckedList[orderId]?.isChecked || false}
                  />
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
          {totalOrderItems.map(
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
                <Td width={scrollTableType[5].width}>{recipientPhoneNumber}</Td>
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
      {!totalOrderItems.length && (
        <NoDataContainer type={TableType.SCROLL}>
          아직 들어온
          <br />
          주문이 없습니다
        </NoDataContainer>
      )}
    </TableContainer>
  );
};

export default OrderTable;
