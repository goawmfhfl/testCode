import React from "react";
import styled, { css } from "styled-components/macro";

const SectionWrapper = ({
  label,
  isRequired = false,
  children,
  marginTop = "88px",
  marginBottom = "88px",
  labelMarginTop = true,
}: {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
  marginTop?: string;
  marginBottom?: string;
  labelMarginTop?: boolean;
}) => {
  return (
    <Container marginTop={marginTop} marginBottom={marginBottom}>
      <InputLabel
        htmlFor=""
        isRequired={isRequired}
        hasTopMargin={labelMarginTop}
      >
        {label}
      </InputLabel>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
};

const Container = styled.div<{ marginTop: string; marginBottom: string }>`
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};

  display: flex;

  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
`;

const requiredInputStyle = css`
  &:after {
    content: "●";
    margin-left: 4px;
    font-size: 0.5em;
  }
`;

const InputLabel = styled.label<{ isRequired: boolean; hasTopMargin: boolean }>`
  min-width: 178px;
  margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "9px" : "")};

  font-family: "SpoqaHanSansNeo";
  font-weight: 700;
  font-size: 14px;
  line-height: 13.86px;

  display: flex;
  align-items: start;

  ${({ isRequired }) => (isRequired ? requiredInputStyle : "")};
`;

const Wrapper = styled.div`
  width: 100%;
  overflow: scroll;
  -ms-overflow-style: none;
`;

export default SectionWrapper;
