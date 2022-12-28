import React from "react";
import styled, { css } from "styled-components/macro";
import { TailSpin } from "react-loader-spinner";
import { TableType } from "@models/index";

interface LoadingProps {
  type: TableType;
}

const Loading = ({ type }: LoadingProps) => {
  return (
    <LoadingContainer type={type}>
      <TailSpin
        height="56"
        width="56"
        color={"#000"}
        ariaLabel="tail-spin-loading"
        visible={true}
      />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div<{ type: TableType }>`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 460px;
  width: 100%;
  background-color: ${({ theme: { palette } }) => palette.white};

  ${({ type }) =>
    type === TableType.SCROLL &&
    css`
      position: absolute;
      top: 40px;
      left: 0;
    `}
`;

export default Loading;
