import React from "react";
import styled from "styled-components";

import Button from "@components/common/Button";

interface FilterBarContainerProps {
  children: React.ReactNode;
  isExportData?: boolean;
}

const FilterBarContainer = ({
  children,
  isExportData,
}: FilterBarContainerProps) => {
  return (
    <Container>
      <FilterList>{children}</FilterList>

      {isExportData && (
        <ButtonWrapper>
          <Button size={"small"}>전체 내역 내보내기</Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  width: 100%;
  min-width: 1182px;

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

const ButtonWrapper = styled.div`
  background-color: ${({ theme: { palette } }) => palette.white};
`;
export default FilterBarContainer;
