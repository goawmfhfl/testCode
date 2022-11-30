import React from "react";
import { useTheme } from "styled-components/macro";
import { useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@components/common/Button";

import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
  loadingSpinnerVisibilityVar,
} from "@cache/index";
import {
  HAS_SET_CONDITIONAL_FREE_SHIPMENT,
  SHIPMENT_PRICE_TYPE,
  unfulfilledInputNamesVar,
} from "@cache/shopSettings";
import { shopSettingsSectionMapper } from "@constants/index";
import { ConditionalFreeShipmentPolicy } from "@constants/shop";
import {
  TemporarySaveShopSettingsInputType,
  SaveShopSettingsInputType,
} from "@models/shopSettings";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";
import { hasEveryInputFulfilled } from "@utils/index";
import restructureShopSettingStates from "@utils/shopSettings/restructureShopSettingStates";
import useShopInfo from "@hooks/useShopInfo";
import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";
import {
  TEMPORARY_SAVE_SHOP_SETTINGS,
  SAVE_SHOP_SETTINGS,
} from "@graphql/mutations/shop";

import Container from "@components/common/saveBar/Container";
import ButtonContainer from "@components/common/saveBar/ButtonContainer";
import TemporarySaveButton from "@components/common/saveBar/TemporarySaveButton";
import SubmitButton from "@components/common/saveBar/SubmitButton";

const SaveBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const formContext = useFormContext();
  const { watch } = formContext;

  const [temporarySaveShopSettings] = useMutation<
    {
      temporarySaveShop: {
        ok: boolean;
        error: string;
        __typename;
      };
    },
    {
      input: TemporarySaveShopSettingsInputType;
    }
  >(TEMPORARY_SAVE_SHOP_SETTINGS, {
    update(cache) {
      const shopInfo = cache.readQuery<{ getShopInfo: ShopInfo }>({
        query: GET_SHOP_INFO,
      });

      const update = {
        ...shopInfo.getShopInfo,
        ...restructureShopSettingStates(watch),
      };

      console.log(update);

      cache.writeQuery({
        query: GET_SHOP_INFO,
        data: {
          getShopInfo: update,
        },
      });
    },
  });

  const [submitShopSettings] =
    useMutation<
      {
        registerShop: {
          ok: boolean;
          error: string;
        };
      },
      {
        input: SaveShopSettingsInputType;
      }
    >(SAVE_SHOP_SETTINGS);

  const { data: shopData, loading } = useShopInfo();

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    loadingSpinnerVisibilityVar(true);

    const temporarySaveShopInput = restructureShopSettingStates(watch);

    console.log("보내는 인풋", temporarySaveShopInput);

    const result = await temporarySaveShopSettings({
      variables: {
        input: temporarySaveShopInput,
      },
    });

    console.log("result", result);

    const {
      data: {
        temporarySaveShop: { ok, error },
      },
    } = result;

    if (!ok) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>임시 저장 중 통신 에러</>,
        cancelButtonVisibility: false,
      });

      console.log(error);

      return;
    }

    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: <>임시저장 되었습니다.</>,
      cancelButtonVisibility: false,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
    });

    loadingSpinnerVisibilityVar(false);
  };

  const handleSubmitButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const input = restructureShopSettingStates(watch);

    const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
    const isShipmentPriceFree = shipmentType === ShipmentChargeType.Free;
    const hasIdentificationCardAuthenticated =
      Boolean(input.identificationCardNumber) &&
      Boolean(input.identificationCardCopyPhoto);
    const isConditionalFreeShipmentUnset =
      watch(HAS_SET_CONDITIONAL_FREE_SHIPMENT) ===
      ConditionalFreeShipmentPolicy.Unset;

    const { isFulfilled, unfulfilledInputNames } = hasEveryInputFulfilled(
      input,
      [
        "safetyAuthentication",
        "safetyAuthenticationExpiredDate",
        "identificationCardNumber",
        "identificationCardCopyPhoto",
        hasIdentificationCardAuthenticated && "representativeName",
        hasIdentificationCardAuthenticated && "businessRegistrationNumber",
        hasIdentificationCardAuthenticated && "isSimpleTaxpayers",
        hasIdentificationCardAuthenticated && "companyLocation",
        hasIdentificationCardAuthenticated && "onlineSalesLicense",
        isConditionalFreeShipmentUnset && "shipmentConditionalPrice",
      ],
      [isShipmentPriceFree && "shipmentPrice"].filter(Boolean)
    );

    if (!isFulfilled) {
      unfulfilledInputNamesVar(unfulfilledInputNames);

      const unfulfilledSectionNames = [
        ...new Set(
          unfulfilledInputNames.map(
            (inputName: string): string => shopSettingsSectionMapper[inputName]
          )
        ),
      ];

      const targetSection = shopSettingsSectionMapper[unfulfilledInputNames[0]];
      const sectionReferenceList = sectionReferenceVar();
      const targetSectionReference = sectionReferenceList[targetSection];

      unfulfilledSectionNames.forEach((sectionName) => {
        sectionFulfillmentVar({
          ...sectionFulfillmentVar(),
          [sectionName]: false,
        });
      });

      const GNBReference: HTMLElement = GNBReferenceVar();
      const SECTION_TOP_MARGIN = 88;

      const scrollTo =
        targetSectionReference.offsetTop -
        GNBReference.offsetHeight -
        SECTION_TOP_MARGIN;

      contentsContainerReferenceVar().scrollTo(0, scrollTo);

      return;
    }

    const result = await submitShopSettings({
      variables: {
        input,
      },
    });

    const {
      data: {
        registerShop: { ok, error },
      },
    } = result;

    if (!ok) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>샵 설정 등록 중 통신 에러</>,
        cancelButtonVisibility: false,
      });

      console.log(error);

      return;
    }

    if (!shopData.getShopInfo.registered) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            샵 설정 등록이 완료되었습니다. <br />
            지금부터 상품 등록 및 판매가 가능합니다.
          </>
        ),
        cancelButtonVisibility: false,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });

      navigate("/product");
    } else {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>저장 되었습니다.</>,
        cancelButtonVisibility: false,
        confirmButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    }
  };

  const hasShopRegistered = shopData?.getShopInfo.registered;

  return (
    <Container>
      <ButtonContainer>
        {!hasShopRegistered && (
          <TemporarySaveButton
            size="big"
            width="126px"
            color={theme.palette.white}
            backgroundColor={theme.palette.grey700}
            // eslint-disable-next-line
            onClick={handleTemporarySaveButtonClick}
          >
            임시 저장
          </TemporarySaveButton>
        )}

        <SubmitButton
          size="big"
          width="126px"
          color={theme.palette.white}
          backgroundColor={theme.palette.red900}
          form="hook-form"
          // eslint-disable-next-line
          onClick={handleSubmitButtonClick}
        >
          {hasShopRegistered ? "저장" : "등록"}
        </SubmitButton>

        <Button size="big" width="126px">
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SaveBar;
