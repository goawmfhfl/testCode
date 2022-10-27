import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
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
import { systemModalVar } from "@cache/index";
import { SHOP_SETTING_SECTIONS } from "@constants/index";

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

import { GetUserInfoType, GET_USER_IFNO } from "@graphql/queries/getUserinfo";
import { AUTH_TOKEN_KEY } from "@constants/auth";

const ShopSetting = () => {
  const navagate = useNavigate();

  const methods = useForm<ShopSettingFormInputType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { data } = useQuery<GetUserInfoType>(GET_USER_IFNO);

  const onSubmit: SubmitHandler<ShopSettingFormInputType> = (data) => {
    console.log("form is submitted!");
    console.log(data);
  };

  const hasUserLoggedIn = false; // TODO: session storage에서 가져온 토큰정보로 판단

  useEffect(() => {
    const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (!authToken) {
      navagate("/login");
    }

    if (data?.getUserInfo?.role === "PRE_SELLER") {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            샵/판매자 정보 설정을 완료하시면
            <br />
            판매 활동을 시작할 수 있습니다.
          </>
        ),
        confirmButtonVisibility: true,
        cancelButtonVisibility: false,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  }, [data]);

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
              <SectionWrapper
                label="샵 정보"
                labelMarginTop={false}
                referenceKey={SHOP_SETTING_SECTIONS.SHOP_INFO}
              >
                <ShopInfo />
              </SectionWrapper>
              <SectionWrapper
                label="정책 설정"
                referenceKey={SHOP_SETTING_SECTIONS.SHOP_POLICY}
              >
                <ShopPolicy />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                label={
                  <>
                    안전기준적합 <br />
                    확인검사 인증
                  </>
                }
                referenceKey={SHOP_SETTING_SECTIONS.SAFETY_CERTIFICATION}
              >
                <SafetyCertification />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                label="샵 배송 정보"
                referenceKey={SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS}
              >
                <ShipmentSettings />
              </SectionWrapper>
            </ContentsSection>

            <ContentsSection>
              <SectionWrapper
                label="사업자 정보(간이, 법인)"
                labelMarginTop={false}
                referenceKey={SHOP_SETTING_SECTIONS.BUSINESS_LICENSE}
              >
                <BusinessLicense />
              </SectionWrapper>

              <SectionWrapper
                label={
                  <>
                    개인판매자 <br /> 주민등록증 인증
                  </>
                }
                referenceKey={SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER}
              >
                <RegistrationNumber />
              </SectionWrapper>

              <SectionWrapper
                label="전화번호 변경"
                referenceKey={SHOP_SETTING_SECTIONS.PHONE_NUMBER}
              >
                <PhoneNumber />
              </SectionWrapper>

              <SectionWrapper
                label="정산 계좌 정보"
                labelMarginTop={false}
                referenceKey={SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT}
              >
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
