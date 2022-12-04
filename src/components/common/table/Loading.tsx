import React from "react";
import styled from "styled-components/macro";
import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <LoadingContainer>
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 460px;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

export default Loading;
