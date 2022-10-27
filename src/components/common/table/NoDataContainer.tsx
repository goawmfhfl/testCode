import React from "react";
import styled from "styled-components";

import exclamationMarkSrc from "@icons/exclamationmark.svg";

interface NoDataContainerProps {
  children: React.ReactNode;
}

const NoDataContainer = ({ children }: NoDataContainerProps) => {
  return (
    <Container>
      <NoticeContainer>
        <ExclamationIcon />
        <NoticeText>{children}</NoticeText>
      </NoticeContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 460px;

  background-color: ${({ theme: { palette } }) => palette.white};
`;

const NoticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoticeText = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;
`;

const ExclamationIcon = styled.img.attrs({ src: exclamationMarkSrc })`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;

  width: 24px;
  height: 24px;
`;

export default NoDataContainer;
