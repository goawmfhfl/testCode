import styled, { useTheme } from "styled-components/macro";
import { gql, useMutation } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { last } from "lodash";

import Button from "@components/common/Button";
import {
  requiredImagesVar,
  optionalImagesVar,
} from "@cache/productRegistration/productImages";
import React from "react";
import {
  SHOP_INTRODUCTION,
  SHIPMENT_POLICY,
  RETURN_POLICY,
  SHIPMENT_BUNDLING,
  SHIPMENT_PRICE_TYPE,
  SHIPMENT_PRICE,
  SHIPMENT_DISTANT_PRICE,
  SHIPMENT_RETURN_PRICE,
  SHIPMENT_EXCHANGE_PRICE,
  SHIPMENT_CONDITIONAL_PRICE,
  shopImagesVar,
  safetyCertificationVar,
  businessLicenseVar,
  registrationNumberVar,
  phoneNumberVar,
  settlementAccountVar,
  sectionMapperVar,
  sectionReferenceVar,
  sectionFulfillmentVar,
} from "@cache/shopSettings";
import { TemporarySaveShopSettingsInputType } from "@models/shopSettings";
import { UploadFileType } from "@models/index";
import { ShipmentChargeType } from "@models/shipmentTemplate";
import {
  systemModalVar,
  contentsContainerReferenceVar,
  GNBReferenceVar,
} from "@cache/index";
import { hasEveryInputFulfilled } from "@utils/index";

const TEMPORARY_SAVE_SHOP_SETTINGS = gql`
  mutation TemporarySaveShop($input: TemporarySaveShopInput!) {
    temporarySaveShop(input: $input) {
      ok
      error
    }
  }
`;

const SUBMIT_SHOP_SETTINGS = gql`
  mutation SubmitShop($input: RegisterShopInput!) {
    registerShop(input: $input) {
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
        input: TemporarySaveShopSettingsInputType;
      }
    >(SUBMIT_SHOP_SETTINGS);

  // useMutation<{
  //   ok: boolean;
  //   error: string;
  // }, {
  //   name
  // }>(TEMPORARY_SAVE_PRODUCT);

  const handleTemporarySaveButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (location.pathname === "/shopSetting") {
      const description = watch(SHOP_INTRODUCTION) as string;
      const shipmentPolicy = watch(SHIPMENT_POLICY) as string;
      const returnPolicy = watch(RETURN_POLICY) as string;

      const { safetyAuthenticationNumber, safetyAuthenticationExpiredDate } =
        safetyCertificationVar();

      const isBundleShipment =
        watch(SHIPMENT_BUNDLING) === "가능" ? true : false;
      const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
      const shipmentPrice = Number(watch(SHIPMENT_PRICE));
      const shipmentDistantPrice = Number(watch(SHIPMENT_DISTANT_PRICE));
      const shipmentConditionalPrice = Number(watch(SHIPMENT_RETURN_PRICE));
      const shipmentReturnPrice = Number(watch(SHIPMENT_EXCHANGE_PRICE));
      const shipmentExchangePrice = Number(watch(SHIPMENT_CONDITIONAL_PRICE));

      const uploadedFileInfos = [
        {
          url: shopImagesVar().mobileImage,
          type: UploadFileType.SHOP_MOBILE,
        },
        {
          url: shopImagesVar().pcImage,
          type: UploadFileType.SHOP_PC,
        },
      ];

      const {
        representativeName,
        businessRegistrationNumber,
        corporateRegistrationNumber,
        isSimpleTaxpayers,
        companyLocation,
        onlineSalesLicense,
      } = businessLicenseVar();

      const {
        identificationCardOwner,
        identificationCardNumber,
        identificationCardIssueDate,
      } = registrationNumberVar();

      const contactNumber = phoneNumberVar();

      const {
        accountNumber: bankAccountNumber,
        accountName: bankAccountHolder,
        bankName,
      } = settlementAccountVar();

      const temporarySaveShopInput = {
        uploadedFileInfos,
        description,
        shipmentPolicy,
        returnPolicy,
        safetyAuthentication: safetyAuthenticationNumber,
        safetyAuthenticationExpiredDate: new Date(
          safetyAuthenticationExpiredDate
        ),
        shipmentType,
        shipmentPrice,
        shipmentDistantPrice,
        shipmentConditionalPrice,
        shipmentReturnPrice,
        shipmentExchangePrice,
        isBundleShipment,
        representativeName,
        businessRegistrationNumber,
        corporateRegistrationNumber,
        isSimpleTaxpayers: isSimpleTaxpayers === "대상" ? true : false,
        companyLocation,
        onlineSalesLicense,
        identificationCardOwner,
        identificationCardNumber,
        identificationCardIssueDate,
        contactNumber,
        bankAccountNumber,
        bankAccountHolder,
        bankName,
      };

      console.log("샵 임시 저장", temporarySaveShopInput);

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
      const description = watch(SHOP_INTRODUCTION) as string;
      const shipmentPolicy = watch(SHIPMENT_POLICY) as string;
      const returnPolicy = watch(RETURN_POLICY) as string;

      const { safetyAuthenticationNumber, safetyAuthenticationExpiredDate } =
        safetyCertificationVar();

      const isBundleShipment =
        watch(SHIPMENT_BUNDLING) === "가능" ? true : false;
      const shipmentType = watch(SHIPMENT_PRICE_TYPE) as ShipmentChargeType;
      const shipmentPrice = Number(watch(SHIPMENT_PRICE));
      const shipmentDistantPrice = Number(watch(SHIPMENT_DISTANT_PRICE));
      const shipmentConditionalPrice = Number(watch(SHIPMENT_RETURN_PRICE));
      const shipmentReturnPrice = Number(watch(SHIPMENT_EXCHANGE_PRICE));
      const shipmentExchangePrice = Number(watch(SHIPMENT_CONDITIONAL_PRICE));

      const uploadedFileInfos = [
        {
          url: shopImagesVar().mobileImage,
          type: UploadFileType.SHOP_MOBILE,
        },
        {
          url: shopImagesVar().pcImage,
          type: UploadFileType.SHOP_PC,
        },
      ];

      const {
        representativeName,
        businessRegistrationNumber,
        corporateRegistrationNumber,
        isSimpleTaxpayers,
        companyLocation,
        onlineSalesLicense,
      } = businessLicenseVar();

      const {
        identificationCardOwner,
        identificationCardNumber,
        identificationCardIssueDate,
      } = registrationNumberVar();

      const contactNumber = phoneNumberVar();

      const {
        accountNumber: bankAccountNumber,
        accountName: bankAccountHolder,
        bankName,
      } = settlementAccountVar();

      const input = {
        uploadedFileInfos,
        description,
        shipmentPolicy,
        returnPolicy,
        safetyAuthentication: safetyAuthenticationNumber,
        safetyAuthenticationExpiredDate: new Date(
          safetyAuthenticationExpiredDate
        ),
        shipmentType,
        shipmentPrice,
        shipmentDistantPrice,
        shipmentConditionalPrice,
        shipmentReturnPrice,
        shipmentExchangePrice,
        isBundleShipment,
        representativeName,
        businessRegistrationNumber,
        corporateRegistrationNumber,
        isSimpleTaxpayers: isSimpleTaxpayers === "대상" ? true : false,
        companyLocation,
        onlineSalesLicense,
        identificationCardOwner,
        identificationCardNumber,
        identificationCardIssueDate,
        contactNumber,
        bankAccountNumber,
        bankAccountHolder,
        bankName,
      };

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
        // 1
        // unfulfilledInputNames를 각각 섹션으로 매핑
        // 중복되는 섹션 이름은 제거
        const sectionMapper = sectionMapperVar();

        const unfulfilledSectionNames = [
          ...new Set(
            unfulfilledInputNames.map(
              (inputName: string): string => sectionMapper[inputName]
            )
          ),
        ];

        // 2
        // 그렇게 unfulfilledSectionName을 얻어내고

        // 2-1
        // 가장 처음으로 등장하는 섹션의 reference를 잡아낸다 (미리 잡아두고 동일한 섹션 키 이름으로 저장해둔다 => Reactive Variable로 관리)
        const targetSection = sectionMapper[unfulfilledInputNames[0]];

        const sectionReferenceList = sectionReferenceVar();

        const targetSectionReference = sectionReferenceList[
          targetSection
        ] as HTMLElement;

        // 2-2
        // 섹션들에 대하여 "인풋 없음" 으로 상태를 변경한다
        unfulfilledSectionNames.forEach((sectionName) => {
          sectionFulfillmentVar({
            ...sectionFulfillmentVar(),
            [sectionName]: false,
          });
        });

        // 3
        // 레퍼런스 위치로 컨텐츠 스크롤 이동

        // eslint-disable-next-line
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
