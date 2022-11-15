import React from "react";
import styled from "styled-components";

import { orderStatusType } from "@constants/order/index";

const FilterBar = () => {
  return (
    <Container>
      <FilterList>
        <Filter isActvie={true}>{orderStatusType.ALL}</Filter>
        <Filter isActvie={false}>{orderStatusType.NEW}</Filter>
        <Filter isActvie={false}>{orderStatusType.PREPARING}</Filter>
        <Filter isActvie={false}>{orderStatusType.SHIPPING}</Filter>
        <Filter isActvie={false}>{orderStatusType.SHIPPING_COMPLETED}</Filter>
      </FilterList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  white-space: nowrap;
`;
const FilterList = styled.ul`
  display: flex;

  height: 48px;
  border-radius: 7px 7px 0px 0px;
  background-color: ${({ theme: { palette } }) => palette.white};

  font-family: "Spoqa Han Sans Neo";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.015em;
  text-align: left;
`;

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
