import React from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";

const Policy = () => {
  const { register } = useFormContext();

  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>정책 설정</SubTitle>
      </SubTitleWrapper>
      <ShopPolicyContainer>
        <SectionContainer>
          <Description>배송 정책</Description>
          <TextAreaContainer>
            <TextArea {...register("deliveryPolicy")} />
          </TextAreaContainer>
        </SectionContainer>
        <SectionContainer>
          <Description>교환/환불 정책</Description>
          <TextAreaContainer>
            <TextArea {...register("returnPolicy")} />
          </TextAreaContainer>
        </SectionContainer>
      </ShopPolicyContainer>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding-bottom: 88px;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey400};
`;

const SubTitleWrapper = styled.div`
  min-width: 235px;
  padding-left: 56px;
`;

const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
`;

const ShopPolicyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 736px;

  & > div:first-child {
    margin-bottom: 48px;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > span {
    margin-bottom: 8px;
  }
`;

const Description = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;

const TextAreaContainer = styled.div`
  display: flex;

  & > span {
    display: flex;
    align-items: flex-end;
    margin-left: 8px;
  }
`;

const TextArea = styled.textarea`
  width: 377px;
  height: 156px;
  background: ${({ theme: { palette } }) => palette.white};
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};

  padding: 8px;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;

  resize: none;
`;

export default Policy;
