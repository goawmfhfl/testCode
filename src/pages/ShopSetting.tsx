/* eslint-disable */
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import ContentsNavigation from "@components/common/ContentsNavigation";
import ContentsNavItem from "@components/common/ContentsNavItem";
import SectionWrapper from "@components/common/SectionWrapper";
import ShopInfo from "@components/ShopSetting/ShopInfo";
import ShopPolicy from "@components/ShopSetting/ShopPolicy";
import SafetyCertification from "@components/ShopSetting/SafetyCertification";
import ShipmentSettings from "@components/ShopSetting/ShipmentSettings";
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

  const hasUserLoggedIn = false; // TODO: session storage에서 가져온 토큰정보로 판단

  const formData = methods.watch();

  console.log(formData);

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
            {hasUserLoggedIn && <ContentsNavItem>탈퇴</ContentsNavItem>}
          </ContentsNavigation>

          <ContentsMain>
            <ContentsSection>
              <SectionWrapper label="샵 정보">
                <ShopInfo />
              </SectionWrapper>
              <SectionWrapper label="정책 설정">
                <ShopPolicy />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label="안전기준적합확인검사 인증">
                <SafetyCertification />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label="기본 배송 설정">
                <ShipmentSettings />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper label="사업자 정보(간이, 법인)">
                <BusinessLicense />
              </SectionWrapper>

              <SectionWrapper label="개인판매자 주민등록증 인증">
                <RegistrationNumber />
              </SectionWrapper>

              <SectionWrapper label="전화번호 변경">
                <PhoneNumber />
              </SectionWrapper>

              <SectionWrapper label="정산 계좌 정보">
                <SettlementAccount />
              </SectionWrapper>
            </ContentsSection>
          </ContentsMain>
        </ContentsContainer>
      </Layout>
    </FormProvider>
  );
};

export default ShopSetting;
