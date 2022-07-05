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
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};

  display: flex;
`;

const requiredInputStyle = css`
  &:after {
    content: "●";
    margin-left: 4px;
    font-size: 0.5em;
    /* align-self: center; */
  }
`;

const InputLabel = styled.label<{ isRequired: boolean }>`
  min-width: 234px;
  margin-top: 9px;

  font-weight: 700;
  font-size: 14px;
  line-height: 13.86px;

  display: flex;
  align-items: start;

  ${({ isRequired }) => (isRequired ? requiredInputStyle : "")};
`;

export default InputWrapper;
