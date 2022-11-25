import React from "react";
import styled from "styled-components";

interface FilterBarContainerProps {
  children: React.ReactNode;
}

const FilterBarContainer = ({ children }: FilterBarContainerProps) => {
  return (
    <Container>
      <FilterList>{children}</FilterList>
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
export default FilterBarContainer;
