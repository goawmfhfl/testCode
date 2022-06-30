import React from "react";
import styled, { css } from "styled-components";

const InputWrapper = ({
  label,
  isRequired = false,
  children,
  marginTop = "88px",
  marginBottom = "88px",
}: {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
  marginTop?: string;
  marginBottom?: string;
}) => {
  return (
    <Container marginTop={marginTop} marginBottom={marginBottom}>
      <InputLabel htmlFor="" isRequired={isRequired}>
        {label}
      </InputLabel>
      {children}
    </Container>
  );
};

const Container = styled.div<{ marginTop: string; marginBottom: string }>`
  background-color: gainsboro;

  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};

  display: flex;
`;

const requiredInputStyle = css`
  &:after {
    width: 5px;
    height: 5px;
    background-color: black;
    border-radius: 50%;
  }
`;

const InputLabel = styled.label<{ isRequired: boolean }>`
  flex-basis: 234px;

  font-weight: 700;
  font-size: 14px;
  line-height: 13.86px;

  padding-left: 56px;
  padding-top: 9px;
  padding-bottom: 9px;

  ${({ isRequired }) => (isRequired ? requiredInputStyle : "")};
`;

export default InputWrapper;
