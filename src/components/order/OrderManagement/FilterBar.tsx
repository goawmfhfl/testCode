import React from "react";
import styled from "styled-components";

import { orderStatusType } from "@constants/order/index";
import FilterBarContainer from "@components/order/FilterBarContainer";

const FilterBar = () => {
  return (
    <FilterBarContainer>
      <Filter isActvie={true}>{orderStatusType.ALL}</Filter>
      <Filter isActvie={false}>{orderStatusType.NEW}</Filter>
      <Filter isActvie={false}>{orderStatusType.PREPARING}</Filter>
      <Filter isActvie={false}>{orderStatusType.SHIPPING}</Filter>
      <Filter isActvie={false}>{orderStatusType.SHIPPING_COMPLETED}</Filter>
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
