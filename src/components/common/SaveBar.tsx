import React from "react";
import styled, { useTheme } from "styled-components/macro";
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
  Pathnames,
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
import restructureShopSettingStates from "@utils/shopSettings/restructureShopSettingStates";
import { restructureProductRegistrationStates } from "@utils/productRegistration";
import useShopInfo from "@hooks/useShopInfo";
import { GET_SHOP_INFO, ShopInfo } from "@graphql/queries/getShopInfo";
import {
  TEMPORARY_SAVE_PRODUCT,
  TEMPORARY_SAVE_SHOP_SETTINGS,
  SAVE_SHOP_SETTINGS,
  CREATE_PRODUCT,
} from "@graphql/mutations/shop";

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

  const { data: shopData, loading } = useShopInfo();

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (location.pathname === Pathnames.Shop) {
      const temporarySaveShopInput = restructureShopSettingStates(watch);

      const result = await temporarySaveShopSettings({
        variables: {
          input: temporarySaveShopInput,
        },
      });

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

      return;
    }

    if (location.pathname === Pathnames.ProductRegistration) {
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

    if (location.pathname === Pathnames.Shop) {
      const input = restructureShopSettingStates(watch);

      const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
      const isShipmentPriceFree = shipmentType === ShipmentChargeType.Free;
      const hasIdentificationCardAuthenticated =
        Boolean(input.identificationCardNumber) &&
        Boolean(input.identificationCardCopyPhoto);

      const { isFulfilled, unfulfilledInputNames } = hasEveryInputFulfilled(
        input,
        [
          "safetyAuthentication",
          "safetyAuthenticationExpiredDate",
          "identificationCardNumber",
          hasIdentificationCardAuthenticated && "representativeName",
          hasIdentificationCardAuthenticated && "businessRegistrationNumber",
          hasIdentificationCardAuthenticated && "isSimpleTaxpayers",
          hasIdentificationCardAuthenticated && "companyLocation",
          hasIdentificationCardAuthenticated && "onlineSalesLicense",
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

      return;
    }

    if (location.pathname === Pathnames.ProductRegistration) {
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
      console.log("상품 생성 결과", result);

      return;
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
