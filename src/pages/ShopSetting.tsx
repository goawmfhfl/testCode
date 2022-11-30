import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { FormProvider, useForm } from "react-hook-form";

import { loadingSpinnerVisibilityVar, systemModalVar } from "@cache/index";
import {
  HeaderNames,
  Pathnames,
  SHOP_SETTING_SECTIONS,
} from "@constants/index";
import { SectionLabels } from "@constants/shop";
import { GetUserInfoType, GET_USER_INFO } from "@graphql/queries/getUserInfo";
import { AUTH_TOKEN_KEY } from "@constants/auth";
import { UserRole } from "@models/login";
import useShopInfo from "@hooks/useShopInfo";
import setShopInfo from "@utils/shopSettings/setShopInfo";
import { ShopFormFields } from "@models/shopSettings";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import ContentsMain from "@components/common/ContentsMain";
import ContentsSection from "@components/common/ContentsSection";
import ContentsNavigation from "@components/common/ContentsNavigation";
import ContentsNavItem from "@components/common/ContentsNavItem";
import SectionWrapper from "@components/common/SectionWrapper";
import ShopInformation from "@components/shopSetting/ShopInfo";
import ShopPolicy from "@components/shopSetting/ShopPolicy";
import SafetyCertification from "@components/shopSetting/SafetyCertification";
import ShipmentSettings from "@components/shopSetting/ShipmentSettings";
import BusinessLicense from "@components/shopSetting/BusinessLicense";
import PhoneNumber from "@components/shopSetting/PhoneNumber";
import SettlementAccount from "@components/shopSetting/SettlementAccount";
import RegistrationNumber from "@components/shopSetting/RegistrationNumber";

const ShopSetting = () => {
  const navagate = useNavigate();

  const methods = useForm<ShopFormFields>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [getUserInfo, { data: userInfo, loading: isUserLoading }] =
    useLazyQuery<GetUserInfoType>(GET_USER_INFO);

  const hasUserLoggedIn = false; // TODO: session storage에서 가져온 토큰정보로 판단

  const { data: shopData, loading: isShopLoading } = useShopInfo();

  const hasSetStoredSettings = useRef(false);

  useEffect(() => {
    if (!shopData) return;

    const hasShopSettingUpdated =
      shopData.getShopInfo.createdAt !== shopData.getShopInfo.updatedAt;

    // eslint-disable-next-line
    (async () => {
      const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (!authToken) {
        navagate(Pathnames.Login);
      }

      const result = await getUserInfo();
      const userRole = result.data.getUserInfo.role;

      if (userRole === UserRole.PRE_SELLER && !hasShopSettingUpdated) {
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
    })();
  }, [userInfo]);

  useEffect(() => {
    if (hasSetStoredSettings.current) return;

    if (!shopData || isShopLoading) return;

    const hasShopSettingUpdated =
      shopData.getShopInfo.createdAt !== shopData.getShopInfo.updatedAt;

    if (shopData.getShopInfo.registered) {
      hasSetStoredSettings.current = true;
      setShopInfo(shopData.getShopInfo, methods.setValue);
    }

    if (
      !shopData.getShopInfo.registered &&
      hasShopSettingUpdated &&
      !hasSetStoredSettings.current
    ) {
      systemModalVar({
        isVisible: true,
        description: (
          <>
            임시 저장된 내용이 존재합니다. <br /> 임시 저장된 내용을
            불러오시겠습니까?
          </>
        ),
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        confirmButtonClickHandler: () => {
          hasSetStoredSettings.current = true;
          setShopInfo(shopData.getShopInfo, methods.setValue);

          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  }, [shopData, hasSetStoredSettings.current]);

  useEffect(() => {
    if (hasSetStoredSettings.current && shopData) {
      setShopInfo(shopData.getShopInfo, methods.setValue);
    }
  }, [shopData, hasSetStoredSettings.current]);

  useEffect(() => {
    const isLoading = isShopLoading || isUserLoading;

    loadingSpinnerVisibilityVar(isLoading);
  }, [isShopLoading, isUserLoading]);

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        {isShopLoading ? (
          <></>
        ) : (
          <ContentsContainer isForm={true}>
            <ContentsHeader headerName={HeaderNames.Shop} />

            <ContentsNavigation>
              <ContentsNavItem selected={true}>
                샵 / 판매자 정보
              </ContentsNavItem>
              {hasUserLoggedIn && <ContentsNavItem>탈퇴</ContentsNavItem>}
            </ContentsNavigation>

            <ContentsMain>
              <ContentsSection>
                <SectionWrapper
                  label={SectionLabels.ShopInfo}
                  labelMarginTop={false}
                  referenceKey={SHOP_SETTING_SECTIONS.SHOP_INFO}
                >
                  <ShopInformation />
                </SectionWrapper>
                <SectionWrapper
                  label={SectionLabels.ShopPolicy}
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
                  label={SectionLabels.ShipmentSettings}
                  referenceKey={SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS}
                >
                  <ShipmentSettings />
                </SectionWrapper>
              </ContentsSection>

              <ContentsSection>
                <SectionWrapper
                  label={SectionLabels.BusinessLicense}
                  labelMarginTop={false}
                  referenceKey={SHOP_SETTING_SECTIONS.BUSINESS_LICENSE}
                >
                  <BusinessLicense />
                </SectionWrapper>

                <SectionWrapper
                  label={
                    <>
                      개인판매자 <br />
                      주인등록증 인증
                    </>
                  }
                  referenceKey={SHOP_SETTING_SECTIONS.REGISTRATION_NUMBER}
                >
                  <RegistrationNumber />
                </SectionWrapper>

                <SectionWrapper
                  label={SectionLabels.PhoneNumber}
                  referenceKey={SHOP_SETTING_SECTIONS.PHONE_NUMBER}
                >
                  <PhoneNumber />
                </SectionWrapper>

                <SectionWrapper
                  label={SectionLabels.SettlementAccount}
                  labelMarginTop={false}
                  referenceKey={SHOP_SETTING_SECTIONS.SETTLEMENT_ACCOUNT}
                >
                  <SettlementAccount />
                </SectionWrapper>
              </ContentsSection>
            </ContentsMain>
          </ContentsContainer>
        )}
      </Layout>
    </FormProvider>
  );
};

export default ShopSetting;
