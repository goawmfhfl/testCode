import React from "react";
import styled from "styled-components/macro";

const ContentsMain = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: #fff;

  margin: 12px 0px;

  & > div:nth-last-child(1) {
    border-bottom: none;
  }
`;

export default ContentsMain;
