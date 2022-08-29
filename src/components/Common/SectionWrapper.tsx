import React from "react";
import styled, { css } from "styled-components/macro";
import { sectionReferenceVar } from "@cache/shopSettings";

const SectionWrapper = ({
  label,
  isRequired = false,
  children,
  marginTop = "88px",
  marginBottom = "88px",
  labelMarginTop = true,
  referenceKey,
}: {
  label: React.ReactNode;
  isRequired?: boolean;
  children: React.ReactNode;
  marginTop?: string;
  marginBottom?: string;
  labelMarginTop?: boolean;
  referenceKey?: string;
}) => {
  return (
    <Container
      marginTop={marginTop}
      marginBottom={marginBottom}
      ref={(newRef) => {
        if (!referenceKey) return;

        sectionReferenceVar({
          ...sectionReferenceVar(),
          [referenceKey]: newRef,
        });
      }}
    >
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

  font-family: "Spoqa Han Sans Neo";
  font-size: 13px;
  font-weight: 400;
  line-height: 15px;
`;

const requiredInputStyle = css`
  &:after {
    content: "●";
    margin-left: 4px;
  }
`;
``;

const InputLabel = styled.label<{ isRequired: boolean; hasTopMargin: boolean }>`
  min-width: 178px;
  margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "5px" : "")};

  font-family: "Spoqa Han Sans Neo";
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  vertical-align: baseline;

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
