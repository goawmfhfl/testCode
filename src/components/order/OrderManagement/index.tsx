import { useEffect } from "react";
import {
  orderCodeType,
  orderProductType,
  orderStatusType,
  PAYMENT_DAY,
  recipientType,
  sellerType,
  shipmentType,
  tableWidth,
} from "@constants/order/orderManagement";

import ContentsHeader from "@components/common/ContentsHeader";
import ContentsContainer from "@components/common/ContentsContainer";
import FilterBar from "@components/order/OrderManagement/FilterBar";
import Controller from "@components/order/OrderManagement/Controller";
import Checkbox from "@components/common/input/Checkbox";
import {
  FixedTable,
  ScrollTable,
  Table,
  TbContainer,
  Td,
  Th,
  ThContainer,
  Tr,
} from "@components/common/table/Table";
import useLazyOrder from "hooks/useLazyOrders";
import { fixedTableData, scrollTableData } from "@cache/order/table";
import { OrderStatus } from "@models/order";
import { HeaderNames } from "@constants/index";

const OrderManagement = () => {
  const { error, loading, orderItems, getOrderItem } = useLazyOrder(
    OrderStatus.NEW
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getOrderItem({
        variables: {
          input: {
            status: OrderStatus.NEW,
          },
        },
      });
    })();
  }, [getOrderItem]);

  return (
    <ContentsContainer>
      <ContentsHeader headerName={HeaderNames.Order} />
      <FilterBar />
      <Controller />
      <Table width={tableWidth.index}>
        <FixedTable width={tableWidth.left}>
          <ThContainer>
            <Th width={fixedTableData[0].width}>
              <Checkbox />
            </Th>
            <Th width={fixedTableData[1].width}>
              {orderCodeType.MERCHANTITEM_UID}
            </Th>
            <Th width={fixedTableData[2].width}>
              {orderCodeType.PRODUCT_CODE}
            </Th>
            <Th width={fixedTableData[3].width}>
              {orderProductType.ORDER_PRODUCT}
            </Th>
            <Th width={fixedTableData[4].width}>{sellerType.NAME}</Th>
            <Th width={fixedTableData[5].width}>{orderStatusType.ORDER}</Th>
          </ThContainer>
          <TbContainer>
            {orderItems.map(
              ({
                orderId,
                merchantitemUid,
                productCode,
                orderProduct,
                sellerName,
                orderState,
              }) => (
                <Tr key={orderId}>
                  <Td width={fixedTableData[0].width}>
                    <Checkbox />
                  </Td>
                  <Td width={fixedTableData[1].width}>{merchantitemUid}</Td>
                  <Td width={fixedTableData[2].width}>{productCode}</Td>
                  <Td width={fixedTableData[3].width}>{orderProduct}</Td>
                  <Td width={fixedTableData[4].width}>{sellerName}</Td>
                  <Td width={fixedTableData[5].width}>{orderState}</Td>
                </Tr>
              )
            )}
          </TbContainer>
        </FixedTable>
        <ScrollTable width={tableWidth.right}>
          <ThContainer>
            <Th width={scrollTableData[0].width}>{orderStatusType.CLAIM}</Th>
            <Th width={scrollTableData[1].width}>{shipmentType.COURIER}</Th>
            <Th width={scrollTableData[2].width}>
              {shipmentType.INVOICE_NUMBER}
            </Th>
            <Th width={scrollTableData[3].width}>{PAYMENT_DAY}</Th>
            <Th width={scrollTableData[4].width}>{recipientType.NAME}</Th>
            <Th width={scrollTableData[5].width}>
              {recipientType.PHONE_NUMBER}
            </Th>

            <Th width={scrollTableData[6].width}>{recipientType.ADDRESS}</Th>

            <Th width={scrollTableData[7].width}>{recipientType.POST_CODE}</Th>

            <Th width={scrollTableData[8].width}>
              {recipientType.SHIPMENT_MEMO}
            </Th>
            <Th width={scrollTableData[9].width}>{sellerType.ID}</Th>
            <Th width={scrollTableData[10].width}>{sellerType.PHONE_NUMBER}</Th>
            <Th width={scrollTableData[11].width}>{orderProductType.OPTION}</Th>
            <Th width={scrollTableData[12].width}>
              {orderProductType.QUANTITY}
            </Th>
            <Th width={scrollTableData[13].width}>{orderProductType.PRICE}</Th>
            <Th width={scrollTableData[14].width}>
              {orderProductType.OPTION_PRICE}
            </Th>
            <Th width={scrollTableData[15].width}>
              {orderProductType.TOTAL_PRICE}
            </Th>
            <Th width={scrollTableData[16].width}>
              {shipmentType.SHIPMENT_PRICE}
            </Th>
            <Th width={scrollTableData[17].width}>
              {shipmentType.SHIPMENT_DISTANT_PRICE}
            </Th>
          </ThContainer>
          <TbContainer>
            {orderItems.map(
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
                  <Td width={scrollTableData[0].width}>{claimState}</Td>
                  <Td width={scrollTableData[1].width}>{courier}</Td>
                  <Td width={scrollTableData[2].width}>{invoiceNumber}</Td>
                  <Td width={scrollTableData[3].width}>{paymentDay}</Td>
                  <Td width={scrollTableData[4].width}>{recipientName}</Td>
                  <Td width={scrollTableData[5].width}>
                    {recipientPhoneNumber}
                  </Td>
                  <Td width={scrollTableData[6].width}>{address}</Td>
                  <Td width={scrollTableData[7].width}>{postCode}</Td>
                  <Td width={scrollTableData[8].width}>{shipmentMemo}</Td>
                  <Td width={scrollTableData[9].width}>{sellerId}</Td>
                  <Td width={scrollTableData[10].width}>{sellerPhoneNumber}</Td>
                  <Td width={scrollTableData[11].width}>{option}</Td>
                  <Td width={scrollTableData[12].width}>{quantity}</Td>
                  <Td width={scrollTableData[13].width}>{price}</Td>
                  <Td width={scrollTableData[14].width}>{optionPrice}</Td>
                  <Td width={scrollTableData[15].width}>{totalPrice}</Td>
                  <Td width={scrollTableData[16].width}>{shipmentPrice}</Td>
                  <Td width={scrollTableData[17].width}>
                    {shipmentDistantPrice}
                  </Td>
                </Tr>
              )
            )}
          </TbContainer>
        </ScrollTable>
      </Table>
    </ContentsContainer>
  );
};

export default OrderManagement;
