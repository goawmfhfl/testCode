/* eslint-disable */
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import ContentsNavigation from "@components/common/ContentsNavigation";
import ContentsNavItem from "@components/common/ContentsNavItem";
import InputWrapper from "@components/common/InputWrapper";
import ShopInfo from "@components/ShopSetting/ShopInfo";
import ShopPolicy from "@components/ShopSetting/ShopPolicy";
import SafetyCertification from "@components/ShopSetting/SafetyCertification";
import DeliveryFee from "@components/ShopSetting/DeliveryFee";
import BusinessLicense from "@components/ShopSetting/BusinessLicense";
import PhoneNumber from "@components/ShopSetting/PhoneNumber";
import SettlementAccount from "@components/ShopSetting/SettlementAccount";
import RegistrationNumber from "@components/ShopSetting/RegistrationNumber";

export interface ShopSettingFormInputType {
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
  const methods = useForm<ShopSettingFormInputType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ShopSettingFormInputType> = (data) => {
    console.log("form is submitted!");
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        <ContentsContainer
          isForm={true}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <ContentsHeader headerName="샵 정보" />

          <ContentsNavigation>
            <ContentsNavItem selected={true}>샵 / 판매자 정보</ContentsNavItem>
            <ContentsNavItem>탈퇴</ContentsNavItem>
          </ContentsNavigation>

          <ContentsMain>
            <ContentsSection>
              <InputWrapper label="샵 정보">
                <ShopInfo />
              </InputWrapper>
              <InputWrapper label="정책 설정">
                <ShopPolicy />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label="안전기준적합확인검사 인증">
                <SafetyCertification />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label="기본 배송 정보">
                <DeliveryFee />
              </InputWrapper>
            </ContentsSection>

            <ContentsSection>
              <InputWrapper label="사업자 정보(간이, 법인)">
                <BusinessLicense />
              </InputWrapper>

              <InputWrapper label="전화번호 변경">
                <PhoneNumber />
              </InputWrapper>

              <InputWrapper label="개인판매자 주민등록증 인증">
                <RegistrationNumber />
              </InputWrapper>

              <InputWrapper label="정산 계좌 정보">
                <SettlementAccount />
              </InputWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

export default ShopSetting;
