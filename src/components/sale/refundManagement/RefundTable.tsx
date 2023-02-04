import React from "react";
import styled from "styled-components";

import {
  fixTableType,
  scrollTableType,
} from "@constants/sale/refundManagement/table";

import { TableType } from "@models/index";
import {
  FixedTable,
  TableContainer,
  TdContainer,
  Th,
  ThContainer,
  Tr,
  Td,
  ScrollTable,
} from "@components/common/table/Table";
import { tableWidth } from "@constants/sale/refundManagement/table";

const RefundTable = () => {
  return (
    <TableContainer type={TableType.SCROLL} hasData={false}>
      <FixedTable>
        <ThContainer>
          <Th width={fixTableType[0].width} type={TableType.SCROLL}></Th>
          <Th width={fixTableType[1].width} type={TableType.SCROLL}>
            {fixTableType[1].label}
          </Th>
          <Th width={fixTableType[2].width} type={TableType.SCROLL}>
            {fixTableType[2].label}
          </Th>
          <Th width={fixTableType[3].width} type={TableType.SCROLL}>
            {fixTableType[3].label}
          </Th>
          <Th width={fixTableType[4].width} type={TableType.SCROLL}>
            {fixTableType[4].label}
          </Th>
          <Th width={fixTableType[5].width} type={TableType.SCROLL}>
            {fixTableType[5].label}
          </Th>
          <Th width={fixTableType[6].width} type={TableType.SCROLL}>
            {fixTableType[6].label}
          </Th>
        </ThContainer>
        <TdContainer>
          <Tr>
            <Td type={TableType.SCROLL} width={fixTableType[0].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[1].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[2].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[3].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[4].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[5].width}></Td>
            <Td type={TableType.SCROLL} width={fixTableType[6].width}></Td>
          </Tr>
        </TdContainer>
      </FixedTable>
      <ScrollTable width={tableWidth.right}>
        <ThContainer>
          <Th type={TableType.SCROLL} width={scrollTableType[0].width}>
            {scrollTableType[0].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[1].width}>
            {scrollTableType[1].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[2].width}>
            {scrollTableType[2].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[3].width}>
            {scrollTableType[3].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[4].width}>
            {scrollTableType[4].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[5].width}>
            {scrollTableType[5].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[6].width}>
            {scrollTableType[6].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[7].width}>
            {scrollTableType[7].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[8].width}>
            {scrollTableType[8].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[9].width}>
            {scrollTableType[9].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[10].width}>
            {scrollTableType[10].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[11].width}>
            {scrollTableType[11].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[12].width}>
            {scrollTableType[12].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[13].width}>
            {scrollTableType[13].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[14].width}>
            {scrollTableType[14].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[15].width}>
            {scrollTableType[15].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[16].width}>
            {scrollTableType[16].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[17].width}>
            {scrollTableType[17].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[18].width}>
            {scrollTableType[18].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[19].width}>
            {scrollTableType[19].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[20].width}>
            {scrollTableType[20].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[21].width}>
            {scrollTableType[21].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[22].width}>
            {scrollTableType[22].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[23].width}>
            {scrollTableType[23].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[24].width}>
            {scrollTableType[24].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[25].width}>
            {scrollTableType[25].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[26].width}>
            {scrollTableType[26].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[27].width}>
            {scrollTableType[27].label}
          </Th>
          <Th type={TableType.SCROLL} width={scrollTableType[28].width}>
            {scrollTableType[28].label}
          </Th>
        </ThContainer>
        <TdContainer>
          <Tr>
            <Td type={TableType.SCROLL} width={scrollTableType[0].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[1].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[2].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[3].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[4].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[5].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[6].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[7].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[8].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[9].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[10].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[11].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[12].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[13].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[14].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[15].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[16].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[17].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[18].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[19].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[20].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[21].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[22].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[23].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[24].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[25].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[26].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[27].width}></Td>
            <Td type={TableType.SCROLL} width={scrollTableType[28].width}></Td>
          </Tr>
        </TdContainer>
      </ScrollTable>
    </TableContainer>
  );
};

export default RefundTable;
