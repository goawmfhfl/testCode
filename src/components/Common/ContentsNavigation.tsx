import React from "react";
import styled from "styled-components/macro";

const ContentsNavigation = ({ children }: { children: React.ReactNode }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  margin-bottom: 12px;

  & > div {
    padding: 12px 56px 12px 56px;
    background-color: ${({ theme: { palette } }) => palette.white};
  }

  & > div:first-child {
    border-radius: 7px 0 0 0;
  }

  & > div:last-child {
    border-radius: 0 7px 0 0;
  }
`;

export default ContentsNavigation;
