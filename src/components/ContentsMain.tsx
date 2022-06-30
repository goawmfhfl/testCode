import React from "react";
import styled from "styled-components";

const ContentsMain = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: skyblue;

  margin: 12px 0px;

  & > div:last-child {
    border-bottom: none;
  }
`;

export default ContentsMain;
