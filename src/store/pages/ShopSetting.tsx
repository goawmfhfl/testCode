/* eslint-disable */
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

import Layout from "@components/common/Layout";
import Represent from "@components/ShopSetting/ShopInfo";
import Policy from "@components/ShopSetting/Policy";
import Safety from "@components/ShopSetting/Safety";
import Order from "@components/ShopSetting/Order";
import BusinessLicense from "@components/ShopSetting/BusinessLicense";
import ChangeNumber from "@components/ShopSetting/PhoneNumber";
import SettlementAccount from "@components/ShopSetting/SettlementAccount";
import RegistrationNumber from "@components/ShopSetting/RegistrationNumber";
import Button from "@components/common/Button";

interface FormType {
  pcImage: string;
  mobileImage: string;
  shopInroduce: string;
  deliveryPolicy: string;
  returnPolicy: string;
  orderOption: string;
  defaultOrderFee: number;
  addtionalOrderFee: number;
}

const ShopSetting = () => {
  const methods = useForm<FormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log("data");
  };

  return (
    <FormProvider {...methods}>
      <Layout>
        <Container onSubmit={methods.handleSubmit(onSubmit)}>
          <HeaderWrapper>
            <HeaderText>샾 설정</HeaderText>
          </HeaderWrapper>
          <MenuContainer>
            <ShopInfoMenu>샵 정보</ShopInfoMenu>
            <WithdrawalMenu>탈퇴</WithdrawalMenu>
          </MenuContainer>
          <MainContainer>
            <Represent />
            <Policy />
            <Safety />
            <Order />
            <BusinessLicense />
            <ChangeNumber />
            <RegistrationNumber />
            <SettlementAccount />
            <ButtonWrapper>
              <Button size="big" full={false}>
                저장
              </Button>
            </ButtonWrapper>
          </MainContainer>
        </Container>
      </Layout>
    </FormProvider>
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
