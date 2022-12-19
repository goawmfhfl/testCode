import React from "react";
import styled, { css } from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import { sectionFulfillmentVar, sectionReferenceVar } from "@cache/index";
import { UnfulfilledStatus } from "@constants/index";

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
  const fulfillmentStatus = useReactiveVar(sectionFulfillmentVar)[referenceKey];

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
      onMouseDown={() => {
        sectionFulfillmentVar({
          ...sectionFulfillmentVar(),
          [referenceKey]: UnfulfilledStatus.Fulfilled,
        });
      }}
    >
      <InputLabelWrapper>
        <InputLabel
          htmlFor=""
          isRequired={isRequired}
          hasTopMargin={labelMarginTop}
        >
          {label}
        </InputLabel>
        <UnfulfilledMessageWrapper>
          {fulfillmentStatus}
        </UnfulfilledMessageWrapper>
      </InputLabelWrapper>

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

const InputLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label<{ isRequired: boolean; hasTopMargin: boolean }>`
  min-width: 178px;
  margin-top: ${({ hasTopMargin }) => (hasTopMargin ? "5px" : "")};

  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  display: flex;
  align-items: start;

  ${({ isRequired }) => (isRequired ? requiredInputStyle : "")};
`;

const UnfulfilledMessageWrapper = styled.div`
  color: red;
  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  margin-top: 4px;
`;

const Wrapper = styled.div`
  width: 100%;
  -ms-overflow-style: none;
`;

export default SectionWrapper;
