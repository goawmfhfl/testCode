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
import { useEffect } from "react";

const OrderTable = () => {
  const { error, loading, totalOrderItems, totalOrderItemsVar, getOrderItem } =
    useLazyOrders();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getOrderItem({
        variables: {
          input: {
            page: 1,
            skip: 20,
            query: null,
            type: OrderSearchType.MERCHANT_UID,
            statusName: OrderStatusName.SHIPPING,
            statusType: OrderStatusType.CLAIM,
            statusGroup: OrderStatusGroup.CANCEL,
          },
        },
      });
    })();
  }, []);

  if (loading) return <>loading...</>;
  if (error) return <>error!</>;

  return (
    <TableContainer type={TableType.SCROLL}>
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
