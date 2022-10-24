import React from "react";
import styled from "styled-components/macro";

const ContentsSection = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};
  min-height: 300px;
  padding: 40px 56px;
`;

export default ContentsSection;
