import React from "react";
import styled from "styled-components";

const ContentsHeader = ({
  headerName,
  children,
}: {
  headerName: string;
  children?: React.ReactNode;
}) => {
  return (
    <Container>
      <Text>{headerName}</Text>
      {children}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme: { palette } }) => palette.white};
  padding: 16px 56px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const Text = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;

  margin-right: 10px;
`;

export default ContentsHeader;
