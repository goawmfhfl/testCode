import React from "react";
import styled from "styled-components";

import triangleSrc from "@icons/triangle.svg";
import Input from "@components/Input";

const Order = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>기본 배송 정보</SubTitle>
      </SubTitleWrapper>
      <OrderInfoContainer>
        <OrderFeeContainer>
          <OrderInfoText>기본 배송비</OrderInfoText>
          <ContentContainer>
            <Select>
              <Option>유료</Option>
              <Option>무료</Option>
            </Select>
            <Input />
            <KrwText>원</KrwText>
          </ContentContainer>
        </OrderFeeContainer>
        <OrderFeeContainer>
          <OrderInfoText>기본 제주 도서산간 추가 배송비</OrderInfoText>
          <ContentContainer>
            <Input />
            <KrwText>원</KrwText>
          </ContentContainer>
        </OrderFeeContainer>
      </OrderInfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 88px 0px;
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

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 24px;
  }
`;

const OrderFeeContainer = styled.div`
  display: flex;

  & > h3 {
    width: 234px;
  }
`;
const OrderInfoText = styled.h3`
  display: flex;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 8px;

  & > input {
    width: 104px;
    height: 32px;
  }
`;

const Select = styled.select`
  border: 1px solid ${({ theme: { palette } }) => palette.grey400};
  padding: 8px 31px 8px 8px;

  -o-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background: url(${triangleSrc}) right no-repeat;
  background-size: 24px;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;
`;
const Option = styled.option``;

const KrwText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
`;

export default Order;
