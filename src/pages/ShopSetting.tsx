import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { FormProvider, useForm } from "react-hook-form";

import {
  loadingSpinnerVisibilityVar,
  sectionFulfillmentInitialValue,
  sectionFulfillmentVar,
  systemModalVar,
} from "@cache/index";
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
import { showHasServerErrorModal } from "@cache/productManagement";
import useAuthGuard from "@hooks/useAuthGuard";
import { phoneNumberVar, unfulfilledInputListVar } from "@cache/shopSettings";

const ShopSetting = () => {
  useAuthGuard();
  const navagate = useNavigate();

  const methods = useForm<ShopFormFields>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [
    getUserInfo,
    { data: userInfo, loading: isUserLoading, error: userError },
  ] = useLazyQuery<GetUserInfoType>(GET_USER_INFO);

  const hasUserLoggedIn = false; // TODO: session storage?????? ????????? ??????????????? ??????

  const {
    data: shopData,
    loading: isShopLoading,
    error: shopError,
  } = useShopInfo();

  const hasSetStoredSettings = useRef(false);

  useEffect(() => {
    if (!shopData || !shopData.getShopInfo.shop) return;

    const hasShopSettingUpdated =
      shopData.getShopInfo.shop.createdAt !==
      shopData.getShopInfo.shop.updatedAt;

    // eslint-disable-next-line
    (async () => {
      const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (!authToken) {
        navagate(Pathnames.Login);
      }

      const result = await getUserInfo();
      const { role: userRole } = result.data.getUserInfo;

      if (userRole === UserRole.PRE_SELLER && !hasShopSettingUpdated) {
        systemModalVar({
          ...systemModalVar(),
          isVisible: true,
          description: (
            <>
              ???/????????? ?????? ????????? ???????????????
              <br />
              ?????? ????????? ????????? ??? ????????????.
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
    if (!shopData || isShopLoading || !shopData.getShopInfo.shop) return;

    const { createdAt, updatedAt, registered } = shopData.getShopInfo.shop;

    const hasShopSettingUpdated = createdAt !== updatedAt;

    // ?????? ??? ????????? ???????????? ?????? ??????????????? ????????????
    phoneNumberVar(shopData.getShopInfo.shop.phoneNumber);

    if (registered) {
      hasSetStoredSettings.current = true;
      setShopInfo(shopData.getShopInfo.shop, methods.setValue);
    }

    if (!registered && !hasShopSettingUpdated) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            ???/????????? ?????? ????????? ???????????????
            <br />
            ?????? ????????? ????????? ??? ????????????.
          </>
        ),
        confirmButtonVisibility: true,
        cancelButtonVisibility: false,
        confirmButtonText: "??????",
        confirmButtonClickHandler: () => {
          hasSetStoredSettings.current = true;

          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });

      return;
    }

    if (!registered && hasShopSettingUpdated && !hasSetStoredSettings.current) {
      systemModalVar({
        isVisible: true,
        description: (
          <>
            ?????? ????????? ????????? ???????????????. <br /> ?????? ????????? ?????????
            ?????????????????????????
          </>
        ),
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        confirmButtonText: "??????",
        cancelButtonText: "??????",
        confirmButtonClickHandler: () => {
          hasSetStoredSettings.current = true;
          setShopInfo(shopData.getShopInfo.shop, methods.setValue);

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
      setShopInfo(shopData.getShopInfo.shop, methods.setValue);
    }
  }, [shopData, hasSetStoredSettings.current]);

  useEffect(() => {
    const isLoading = isShopLoading || isUserLoading;

    loadingSpinnerVisibilityVar(isLoading);

    if (userError) {
      showHasServerErrorModal(userError.message, "?????? ????????????");
    }

    if (shopError) {
      showHasServerErrorModal(shopError.message, "??? ?????? ????????????");
    }
  }, [isShopLoading, isUserLoading, userError, shopError]);

  useEffect(() => {
    initializeFormStatus();
  }, []);

  const initializeFormStatus = () => {
    unfulfilledInputListVar([]);
    sectionFulfillmentVar(sectionFulfillmentInitialValue);
  };

  return (
    <FormProvider {...methods}>
      <Layout hasSaveBar={true}>
        {isShopLoading ? (
          <></>
        ) : (
          <ContentsContainer isForm={true}>
            <ContentsHeader headerName={HeaderNames.Shop} />

            <ContentsNavigation>
              <ContentsNavItem selected={true}>??? ??????</ContentsNavItem>
              {hasUserLoggedIn && <ContentsNavItem>??????</ContentsNavItem>}
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

              {/* <ContentsSection>
                <SectionWrapper
                  label={
                    <>
                      ?????????????????? <br />
                      ???????????? ??????
                    </>
                  }
                  referenceKey={SHOP_SETTING_SECTIONS.SAFETY_CERTIFICATION}
                >
                  <SafetyCertification />
                </SectionWrapper>
              </ContentsSection> */}

              {/* <ContentsSection>
                <SectionWrapper
                  label={SectionLabels.ShipmentSettings}
                  referenceKey={SHOP_SETTING_SECTIONS.SHIPMENT_SETTINGS}
                >
                  <ShipmentSettings />
                </SectionWrapper>
              </ContentsSection> */}

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
                      ??????????????? <br />
                      ?????????????????? ??????
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
