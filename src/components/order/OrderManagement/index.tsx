import {
  orderCodeType,
  orderProductType,
  orderStatusType,
  ORDER_MANAGEMENT,
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
import { fixedTableData, scrollTableData } from "@cache/order/table";

const OrderManagement = () => {
  return (
    <ContentsContainer>
      <ContentsHeader headerName={ORDER_MANAGEMENT} />
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
            <Tr>
              <Td width={fixedTableData[0].width}>
                <Checkbox />
              </Td>
              <Td width={fixedTableData[1].width} />
              <Td width={fixedTableData[2].width} />
              <Td width={fixedTableData[3].width} />
              <Td width={fixedTableData[4].width} />
              <Td width={fixedTableData[5].width} />
            </Tr>
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
            {/*  */}
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
            <Tr>
              <Td width={scrollTableData[0].width} />
              <Td width={scrollTableData[1].width} />
              <Td width={scrollTableData[2].width} />
              <Td width={scrollTableData[3].width} />
              <Td width={scrollTableData[4].width} />
              <Td width={scrollTableData[5].width} />
              <Td width={scrollTableData[6].width} />
              <Td width={scrollTableData[7].width} />
              <Td width={scrollTableData[8].width} />
              <Td width={scrollTableData[9].width} />
              <Td width={scrollTableData[10].width} />
              <Td width={scrollTableData[11].width} />
              <Td width={scrollTableData[12].width} />
              <Td width={scrollTableData[13].width} />
              <Td width={scrollTableData[14].width} />
              <Td width={scrollTableData[15].width} />
              <Td width={scrollTableData[16].width} />
              <Td width={scrollTableData[17].width} />
            </Tr>
          </TbContainer>
        </ScrollTable>
      </Table>
    </ContentsContainer>
  );
};

export default OrderManagement;
