import React from "react";
import styled from "styled-components";

const ContentsSection = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: pink;

  border-bottom: 1px solid grey;
  min-height: 300px;
  padding: 40px 56px;
`;

export default ContentsSection;
