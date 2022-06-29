import React from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";

import Button from "@components/Common/Button";
import AccountModal from "./AccountModal";

const Account = () => {
  const { register } = useFormContext();
  return (
    <Container>
      <SubTitleWrapper>
        <SubTitle>정산 계좌 정보</SubTitle>
      </SubTitleWrapper>
      <AccountContainer>
        <AccountInfoText>등록된 계좌 정보</AccountInfoText>
        <RegisterContainer>
          <AccountInfoText>
            등록된 계좌 정보가 없습니다.
            {/* 국민은행 632902-**-****** (예금주명: 김지원) */}
          </AccountInfoText>
          <Button size="small" full={false}>
            등록
          </Button>
          {/* <Button size="small" full={false}>
            변경
          </Button> */}
        </RegisterContainer>
      </AccountContainer>
      {/* <AccountModal /> */}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
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

const AccountContainer = styled.div`
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

export default Account;
