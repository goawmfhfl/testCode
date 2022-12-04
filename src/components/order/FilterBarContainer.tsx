import React from "react";
import styled from "styled-components/macro";

import { useReactiveVar } from "@apollo/client";

import { commonFilterOptionVar } from "@cache/index";

interface FilterBarContainerProps {
  children: React.ReactNode;
  button?: React.ReactNode;
  searchResultLength?: number;
}

const FilterBarContainer = ({
  children,
  button,
  searchResultLength,
}: FilterBarContainerProps) => {
  const { query } = useReactiveVar(commonFilterOptionVar);

  return (
    <Container>
      <FilterList>
        {!query && children}
        {query && <Filter isActvie={true}>검색 {searchResultLength}</Filter>}
      </FilterList>

      {button && <ButtonWrapper>{button}</ButtonWrapper>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  width: 100%;
  /* min-width: 1182px; */

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

const ButtonWrapper = styled.div`
  background-color: ${({ theme: { palette } }) => palette.white};
  border: ${({ theme }) => `1px solid ${theme.palette.grey500}`};
`;
export default FilterBarContainer;
