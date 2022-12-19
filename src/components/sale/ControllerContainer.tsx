import React from "react";
import styled from "styled-components/macro";

interface ControllerContainerProps {
  children: React.ReactNode;
}

const ControllerContainer = ({ children }: ControllerContainerProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px;
  background-color: ${({ theme: { palette } }) => palette.white};

  white-space: nowrap;
`;

export default ControllerContainer;
