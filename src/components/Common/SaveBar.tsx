import React from "react";
import styled, { useTheme } from "styled-components/macro";
import { gql, useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";

import Button from "@components/common/Button";

import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
} from "@cache/index";
import { SHIPMENT_PRICE_TYPE } from "@cache/shopSettings";
import {
  HAS_REQUIRED_OPTION,
  HAS_MANUFACTURING_LEAD_TIME,
  SHIPMENT_TEMPLATE,
  IS_DISCOUNTED,
  HAS_SELECTIVE_OPTION,
  HAS_TAG_INFOS,
} from "@cache/productRegistration";
import { shipmentTemplatesVar } from "@cache/productRegistration/shipmentTemplate";
import {
  shopSettingsSectionMapper,
  productRegistrationSectionMapper,
} from "@constants/index";

import {
  TemporarySaveShopSettingsInputType,
  SaveShopSettingsInputType,
} from "@models/shopSettings";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";
import {
  CreateProductInputType,
  TemporarySaveProductInputType,
} from "@models/productRegistration/index";

import { hasEveryInputFulfilled } from "@utils/index";
import { restructureShopSettingStates } from "@utils/shopSettings";
import { restructureProductRegistrationStates } from "@utils/productRegistration";

const TEMPORARY_SAVE_SHOP_SETTINGS = gql`
  mutation TemporarySaveShop($input: TemporarySaveShopInput!) {
    temporarySaveShop(input: $input) {
      ok
      error
    }
  }
`;

const SAVE_SHOP_SETTINGS = gql`
  mutation SubmitShop($input: RegisterShopInput!) {
    registerShop(input: $input) {
      ok
      error
    }
  }
`;

const TEMPORARY_SAVE_PRODUCT = gql`
  mutation TemporarySaveProduct($input: TemporarySaveProductInput!) {
    temporarySaveProduct(input: $input) {
      ok
      error
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ok
      error
    }
  }
`;

const SaveBar = () => {
  const theme = useTheme();

  const formContext = useFormContext();
  const { watch } = formContext;

  const [temporarySaveShopSettings] = useMutation<
    {
      temporarySaveShop: {
        ok: boolean;
        error: string;
      };
    },
    {
      input: TemporarySaveShopSettingsInputType;
    }
  >(TEMPORARY_SAVE_SHOP_SETTINGS);

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

  const [temporarySaveProduct] = useMutation<
    {
      temporarySaveProduct: {
        ok: boolean;
        error: string;
      };
    },
    {
      input: TemporarySaveProductInputType;
    }
  >(TEMPORARY_SAVE_PRODUCT);

  const [createProduct] =
    useMutation<
      {
        createProduct: {
          ok: boolean;
          error: string;
        };
      },
      {
        input: CreateProductInputType;
      }
    >(CREATE_PRODUCT);

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (location.pathname === "/shopSetting") {
      const temporarySaveShopInput = restructureShopSettingStates(watch);

      const {
        data: {
          temporarySaveShop: { ok, error },
        },
      } = await temporarySaveShopSettings({
        variables: {
          input: temporarySaveShopInput,
        },
      });

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
      });

      return;
    }

    if (location.pathname === "/productRegistration") {
      const input = restructureProductRegistrationStates(formContext);

      const result = await temporarySaveProduct({
        variables: {
          input,
        },
      });

      return;
    }
  };

  const handleSubmitButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (location.pathname === "/shopSetting") {
      const input = restructureShopSettingStates(watch);

      const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
      const isShipmentPriceFree = shipmentType === ShipmentChargeType.Free;

      const { isFulfilled, unfulfilledInputNames } = hasEveryInputFulfilled(
        input,
        [
          "safetyAuthentication",
          "safetyAuthenticationExpiredDate",
          "identificationCardOwner",
          "identificationCardNumber",
          "identificationCardIssueDate",
        ],
        [
          isShipmentPriceFree && "shipmentPrice",
          isShipmentPriceFree && "shipmentConditionalPrice",
        ].filter(Boolean)
      );

      if (!isFulfilled) {
        const unfulfilledSectionNames = [
          ...new Set(
            unfulfilledInputNames.map(
              (inputName: string): string =>
                shopSettingsSectionMapper[inputName]
            )
          ),
        ];

        const targetSection =
          shopSettingsSectionMapper[unfulfilledInputNames[0]];
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

      const {
        data: {
          registerShop: { ok, error },
        },
      } = await submitShopSettings({
        variables: {
          input,
        },
      });

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

      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: <>저장 되었습니다.</>,
        cancelButtonVisibility: false,
      });

      return;
    }

    if (location.pathname === "/productRegistration") {
      const input = restructureProductRegistrationStates(formContext);

      const isDiscounted = watch(IS_DISCOUNTED) as boolean;
      const hasTemplateSelected = shipmentTemplatesVar().find(
        (template) => template.name === watch(SHIPMENT_TEMPLATE)
      );
      const hasRequiredOption = watch(HAS_REQUIRED_OPTION) as boolean;
      const hasSelectiveOption = watch(HAS_SELECTIVE_OPTION) as boolean;
      const hasLeadtime = watch(HAS_MANUFACTURING_LEAD_TIME) as boolean;
      const isShipmentPriceFree =
        watch(SHIPMENT_PRICE_TYPE) === ShipmentChargeType.Free;
      const hasTagInfo = watch(HAS_TAG_INFOS) as boolean;

      const { isFulfilled, unfulfilledInputNames } = hasEveryInputFulfilled(
        input,
        [
          !isDiscounted && "discountAmount",
          !isDiscounted && "discountMethod",
          !isDiscounted && "discountAppliedPrice",
          !isDiscounted && "startDiscountDate",
          !isDiscounted && "endDiscountDate",
          !hasRequiredOption && !hasSelectiveOption && "optionCombinations",
          !hasRequiredOption && "requiredOptions",
          !hasSelectiveOption && "selectiveOptions",
          !hasLeadtime && "manufacturingLeadTime",
          "shipmentId",
          hasTemplateSelected && "isBundleShipment",
          hasTemplateSelected && "shipmentType",
          hasTemplateSelected && "shipmentPrice",
          hasTemplateSelected && "shipmentDistantPrice",
          hasTemplateSelected && "shipmentReturnPrice",
          hasTemplateSelected && "shipmentExchangePrice",
          "authorization",
          !hasTagInfo && "tagInfos",
        ],
        [
          !isDiscounted && "discountAmount",
          !isDiscounted && "discountAppliedPrice",
          hasRequiredOption && "quantity",
          isShipmentPriceFree && "shipmentPrice",
        ]
      );

      if (!isFulfilled) {
        const unfulfilledSectionNames = [
          ...new Set(
            unfulfilledInputNames.map((inputName: string): string => {
              return productRegistrationSectionMapper[inputName];
            })
          ),
        ];

        unfulfilledSectionNames.forEach((sectionName) => {
          sectionFulfillmentVar({
            ...sectionFulfillmentVar(),
            [sectionName]: false,
          });
        });

        const targetSection = unfulfilledSectionNames[0];
        const sectionReferenceList = sectionReferenceVar();
        const targetSectionReference = sectionReferenceList[targetSection];

        const GNBReference: HTMLElement = GNBReferenceVar();
        const SECTION_TOP_MARGIN = 88;

        const scrollTo =
          targetSectionReference.offsetTop -
          GNBReference.offsetHeight -
          SECTION_TOP_MARGIN;

        contentsContainerReferenceVar().scrollTo(0, scrollTo);

        return;
      }

      const result = await createProduct({
        variables: {
          input,
        },
      });

      // TODO: 등록 상태에 따른 systemModal 메시지

      return;
    }
  };

  return (
    <Container>
      <ButtonContainer>
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

        <SubmitButton
          size="big"
          width="126px"
          color={theme.palette.white}
          backgroundColor={theme.palette.red900}
          form="hook-form"
          // eslint-disable-next-line
          onClick={handleSubmitButtonClick}
        >
          등록
        </SubmitButton>

        <Button size="big" width="126px">
          취소
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100vw;
  height: 72px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  background-color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-right: 30px;
`;

const TemporarySaveButton = styled(Button)``;

const SubmitButton = styled(Button).attrs({
  type: "submit",
})``;

export default SaveBar;
