import React from "react";
import styled, { useTheme } from "styled-components/macro";
import { gql, useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { last } from "lodash";

import Button from "@components/common/Button";
import {
  requiredImagesVar,
  optionalImagesVar,
} from "@cache/productRegistration/productImages";

import {
  SHIPMENT_PRICE_TYPE,
  sectionMapperVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
} from "@cache/shopSettings";
import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
} from "@cache/index";

import {
  TemporarySaveShopSettingsInputType,
  SaveShopSettingsInputType,
} from "@models/shopSettings";
import { ShipmentChargeType } from "@models/productRegistration/shipmentTemplate";
import { CreateProductInputType } from "@models/productRegistration/index";

import { hasEveryInputFulfilled } from "@utils/index";
import { reorganizeShopSettingStates } from "@utils/shopSettings";

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

  const { watch, getValues } = useFormContext();

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

  useMutation<
    {
      temporarySaveProduct: {
        ok: boolean;
        error: string;
      };
    },
    {
      name;
    }
  >(TEMPORARY_SAVE_PRODUCT);

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
      const temporarySaveShopInput = reorganizeShopSettingStates(watch);

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
      const categoryName = getCategoryName();

      console.log("categoryName", categoryName);

      const photoInfos = getPhotoInfos();

      console.log("photoInfos", photoInfos);

      return;
    }
  };

  const handleSubmitButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (location.pathname === "/shopSetting") {
      const input = reorganizeShopSettingStates(watch);

      console.log("제대로 가져왔나! - shop submit", input);

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

      console.log("unfulfilled", unfulfilledInputNames);

      if (!isFulfilled) {
        const sectionMapper = sectionMapperVar();

        const unfulfilledSectionNames = [
          ...new Set(
            unfulfilledInputNames.map(
              (inputName: string): string => sectionMapper[inputName]
            )
          ),
        ];

        const targetSection = sectionMapper[unfulfilledInputNames[0]];
        const sectionReferenceList = sectionReferenceVar();
        const targetSectionReference = sectionReferenceList[
          targetSection
        ] as HTMLElement;

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
      const photoInfos = getPhotoInfos();

      console.log("photoInfos", photoInfos);

      getCategoryName();

      return;
    }
  };

  function getPhotoInfos() {
    const requiredImages = [...requiredImagesVar()].map(({ type, url }) => ({
      type,
      url,
    }));

    const optionalImages = [...optionalImagesVar()].map(({ type, url }) => ({
      type,
      url,
    }));

    return [...requiredImages, ...optionalImages].filter((image) => image.url);
  }

  function getCategoryName(): string | void {
    const categories = getValues([
      "categoryDepthFirst",
      "categoryDepthSecond",
      "categoryDepthThird",
    ]);

    console.log("categories", categories);

    return last(categories.filter((category) => category)) as
      | string
      | undefined;
  }

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
