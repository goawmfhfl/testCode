import React from "react";
import styled from "styled-components";

import Button from "@components/Button";

const AccountInfo = () => {
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>정산 계좌 정보</SubTitle>
      </SubTitleWrapper>
      <AccountInfoContainer>
        <AccountInfoText>등록된 계좌 정보</AccountInfoText>
        <RegisterContainer>
          <AccountInfoText>등록된 계좌 정보가 없습니다.</AccountInfoText>
          <Button size="small" full={false}>
            등록
          </Button>
        </RegisterContainer>
      </AccountInfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 88px;
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

const AccountInfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 736px;

  & > :first-child {
    margin-bottom: 21px;
  }
`;

const AccountInfoText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
`;

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;

  & > :first-child {
    margin-right: 16px;
  }

  & > button {
    padding: 9px 16px;

    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.1px;
  }
`;

export default AccountInfo;
