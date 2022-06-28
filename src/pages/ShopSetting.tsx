import React from "react";
import styled from "styled-components";
import Layout from "@components/Layout";

import MainInfo from "@components/ShopSetting/MainInfo";
import PolicyInfo from "@components/ShopSetting/PolicyInfo";
import SafetyInfo from "@components/ShopSetting/SafetyInfo";
import OrderInfo from "@components/ShopSetting/OrderInfo";
import EnterPreneurInfo from "@components/ShopSetting/EnterPreneurInfo";
import ChangeNumberInfo from "@components/ShopSetting/ChangeNumberInfo";
import AccountInfo from "@components/ShopSetting/AccountInfo";
import IdentifiCationInfo from "@components/ShopSetting/IdentifiCationInfo";
import Button from "@components/Button";

const ShopSetting = () => {
  return (
    <Layout>
      <Container>
        <HeaderWrapper>
          <HeaderText>샾 설정</HeaderText>
        </HeaderWrapper>
        <MenuContainer>
          <ShopInfoMenu>샵 정보</ShopInfoMenu>
          <WithdrawalMenu>탈퇴</WithdrawalMenu>
        </MenuContainer>
        <MainContainer>
          <MainInfo />
          <PolicyInfo />
          <SafetyInfo />
          <OrderInfo />
          <EnterPreneurInfo />
          <ChangeNumberInfo />
          <IdentifiCationInfo />
          <AccountInfo />
          <ButtonWrapper>
            <Button size="big" full={false}>
              저장
            </Button>
          </ButtonWrapper>
        </MainContainer>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px 56px 24px;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;
const HeaderWrapper = styled.header`
  background-color: ${({ theme: { palette } }) => palette.white};
  padding: 16px 0px 16px 56px;
  margin-bottom: 16px;
`;
const HeaderText = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;
const MenuContainer = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;

  margin-bottom: 16px;
  & > div {
    padding: 12px 56px 12px 56px;
    background-color: ${({ theme: { palette } }) => palette.white};
  }
`;
const ShopInfoMenu = styled.div`
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;
const WithdrawalMenu = styled.div`
  /* border-bottom: 1px solid ${({ theme: { palette } }) => palette.grey500}; */
`;
const MainContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme: { palette } }) => palette.white};
`;

const ButtonWrapper = styled.div`
  margin: 0 auto;
  padding-bottom: 40px;

  & > button {
    width: 126px;

    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.015em;
  }
`;
export default ShopSetting;
