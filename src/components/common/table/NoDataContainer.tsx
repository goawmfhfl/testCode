import React from "react";
import styled, { css } from "styled-components";

import exclamationMarkSrc from "@icons/exclamationmark.svg";
import { TableType } from "@models/index";

interface NoDataContainerProps {
  children: React.ReactNode;
  type: TableType;
}

const NoDataContainer = ({ children, type }: NoDataContainerProps) => {
  return (
    <Container type={type}>
      <NoticeContainer>
        <ExclamationIcon />
        <NoticeText>{children}</NoticeText>
      </NoticeContainer>
    </Container>
  );
};

const Container = styled.div<{ type: TableType }>`
  ${({ type }) =>
    type === TableType.SCROLL &&
    css`
      position: absolute;
      top: 40px;
      left: 0;
    `}

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
